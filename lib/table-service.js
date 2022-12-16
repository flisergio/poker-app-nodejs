import State from "./state.js";
import Player from "./player.js";
import Action from "./action.js";
import Deck from "./deck.js";
import Winner from "./winners.js";
import { IllegalActionError, IllegalAmountError } from "./errors.js";

const PlayerState = { INACTIVE: "inactive", ACTIVE: "active", ENDED: "ENDED" };
export default class TableService {
  static #instance = null;

  #state = State.OPEN;
  #players = [];
  #currentPlayer;
  #deck;
  #communityCards = [];
  #pot = 0;
  #currentBet = 0;
  #activeUserNumber;
  #winner = {
    winner: null,
    winningHand: [],
  };

  static getInstance() {
    if (!TableService.#instance) {
      TableService.#instance = new TableService();
    }
    return TableService.#instance;
  }

  constructor() {}

  get state() {
    return this.#state;
  }

  get players() {
    return this.#players;
  }

  getPlayerCards(playerId) {
    const player = this.#players.find((player) => player.id === playerId);
    return player ? player.cards : [];
  }

  get communityCards() {
    return this.#communityCards;
  }

  get currentPlayer() {
    return this.#state === State.OPEN ? null : this.#currentPlayer;
  }

  get bets() {
    let bets = {};
    if (this.#currentBet) {
      this.#players.forEach(
        function (player) {
          bets[player.id] = player.currentBet;
        }.bind(this)
      );
    }
    return bets;
  }

  get pot() {
    return this.#pot;
  }

  get winner() {
    if (this.#state !== State.ENDED) {
      return null;
    }
    return this.#winner.winner;
  }

  #determineWinner() {
    const activePlayers = this.#getActivePlayers();
    if (activePlayers.length === 1) {
      return {
        winner: activePlayers[0],
        winningHand: [],
      };
    }
    let playerCards = [];
    activePlayers.forEach((player) => playerCards.push(player.cards));
    return new Winner(
      activePlayers,
      playerCards,
      this.#communityCards
    ).determine()[0];
  }

  get winnerHand() {
    if (this.#state !== State.ENDED) {
      return [];
    }
    return this.#winner.winningHand;
  }

  start() {
    if (!this.#players || this.#players.length < 2) {
      throw new IllegalActionError(
        "Can not start: The number of player is less than 2"
      );
    }
    this.#state = State.PRE_FLOP;
    this.#currentPlayer = this.#players[0];
    this.#deck = new Deck();
    this.#players.forEach(
      function (player) {
        player.addCard(this.#deck.draw(1)[0]);
        player.addCard(this.#deck.draw(1)[0]);
        player.state = PlayerState.ACTIVE;
      }.bind(this)
    );
    this.#activeUserNumber = this.#players.length;
  }

  addPlayer({ id, name }) {
    let player = new Player({ id, name, cash: 100 });
    player.state = PlayerState.INACTIVE;
    player.bet = 0;
    player.currentBet = 0;
    this.#players.push(player);
  }

  performAction(action, ...args) {
    switch (action) {
      case Action.CHECK:
        this.performCheck();
        break;
      case Action.FOLD:
        this.performFold();
        break;
      case Action.RAISE:
        this.performRaise(args[0]);
        break;
      case Action.CALL:
        this.performCall();
        break;
      default:
    }
    if (this.#state !== State.ENDED) {
      if (this.#isEndOfRound()) {
        this.#switchToNextState();
      } else {
        this.#switchToNextActivePlayer();
      }
    }
  }

  performFold() {
    this.#currentPlayer.state = PlayerState.INACTIVE;
    this.#activeUserNumber--;
    if (this.#activeUserNumber === 1) {
      this.#clearCurentBet();
      this.#endGame();
    }
  }
  performRaise(amount) {
    if (
      amount <= this.#currentBet ||
      amount > this.#currentPlayer.cash - amount ||
      this.#checkCash(amount)
    ) {
      throw new IllegalAmountError("Illegal Amount");
    }
    this.#currentBet = amount;
    this.#currentPlayer.deductCash(amount);
    this.#currentPlayer.bet += amount;
    this.#currentPlayer.currentBet += amount;
    this.#pot += amount;
  }
  #checkCash(amount) {
    return this.#players.some(
      function (player) {
        if (player.state === PlayerState.ACTIVE) {
          return amount > player.cash;
        }
        return false;
      }.bind(this)
    );
  }
  performCall() {
    let amount = this.#currentBet - this.#currentPlayer.currentBet;
    if (!this.#currentBet) {
      throw new IllegalActionError("Can not call: nobody has raised");
    }
    this.#currentPlayer.deductCash(amount);
    this.#currentPlayer.bet += amount;
    this.#currentPlayer.currentBet = this.#currentBet;
    this.#pot += amount;
  }
  performCheck() {
    if (this.#currentBet) {
      throw new IllegalActionError("Can not check: someone has raised");
    }
  }
  #isEndOfRound() {
    if (!this.#currentBet) {
      return !this.#getNextActivePlayer();
    }
    return !this.#players.some(
      function (player) {
        if (player.state === PlayerState.ACTIVE) {
          return player.currentBet !== this.#currentBet;
        }
        return false;
      }.bind(this)
    );
  }
  #switchToNextActivePlayer() {
    const nextPlayer = this.#getNextActivePlayer();
    if (nextPlayer) {
      this.#currentPlayer = nextPlayer;
    } else {
      this.#currentPlayer = this.#getFirstActivePlayer();
    }
  }
  #switchToNextState() {
    switch (this.#state) {
      case State.PRE_FLOP:
        this.#state = State.FLOP;
        this.#communityCards = this.#deck.draw(3);
        break;
      case State.FLOP:
        this.#state = State.TURN;
        this.#communityCards = [...this.#communityCards, ...this.#deck.draw(1)];
        break;
      case State.TURN:
        this.#state = State.RIVER;
        this.#communityCards = [...this.#communityCards, ...this.#deck.draw(1)];
        break;
      case State.RIVER:
        this.#endGame();
        break;
      default:
    }
    this.#currentPlayer = this.#getFirstActivePlayer();
    this.#clearCurentBet();
  }
  #clearCurentBet() {
    this.#currentBet = 0;
    this.#players.forEach(
      function (player) {
        player.currentBet = 0;
      }.bind(this)
    );
  }
  #endGame() {
    this.#state = State.ENDED;
    this.#winner = this.#determineWinner();
    this.#winner.winner.addCash(this.#pot);
    this.#pot = 0;
  }
  #getNextActivePlayer() {
    let currentPlayerIndex = this.#players.length;
    return this.#players.find(
      function (player, index) {
        if (player.id === this.#currentPlayer.id) {
          currentPlayerIndex = index;
        }
        return (
          player.state === PlayerState.ACTIVE && index > currentPlayerIndex
        );
      }.bind(this)
    );
  }
  #getFirstActivePlayer() {
    return this.#players.find(
      function (player) {
        return player.state === PlayerState.ACTIVE;
      }.bind(this)
    );
  }
  #getActivePlayers() {
    return this.#players.filter(
      function (player) {
        return player.state === PlayerState.ACTIVE;
      }.bind(this)
    );
  }
}
