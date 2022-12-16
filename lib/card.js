export default class Card {
  static SUITS = ['spades', 'hearts', 'diamonds', 'clubs']
  static RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']

  #rank = ''
  #suit = ''

  constructor({ suit, rank }) {
    this.#suit = suit
    this.#rank = rank
  }

  get rank() {
    return this.#rank
  }

  get suit() {
    return this.#suit
  }

  compareTo(card) {
    return Card.RANKS.indexOf(this.#rank) - Card.RANKS.indexOf(card.rank)
  }

  toJSON() {
    return {
      rank: this.#rank,
      suit: this.#suit
    }
  }
}
