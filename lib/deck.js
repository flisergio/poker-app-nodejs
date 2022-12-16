import shuffle from 'lodash.shuffle'
import Card from './card.js'

export default class Deck {
  #cards = []

  constructor() {
    this.#init()
    this.#shuffle()
  }

  get cards() {
    return this.#cards
  }

  #init() {
    this.#cards = []
    for (const suit of Card.SUITS) {
      for (const rank of Card.RANKS) {
        this.#cards.push(new Card({ suit, rank }))
      }
    }
  }

  #shuffle() {
    this.#cards = shuffle(this.#cards)
  }

  draw(count = 1) {
    if (this.#cards.length < count) {
      throw new Error('Not enough remaining cards')
    }
    const drawnCards = this.#cards.splice(0, count)
    return drawnCards
  }
}
