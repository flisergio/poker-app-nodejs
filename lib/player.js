export default class Player {
  #id = ''
  #name = ''
  #cash = 0
  #playerCards = []

  constructor({ id, name, cash }) {
    this.#id = id
    this.#name = name
    this.#cash = cash
  }

  get id() {
    return this.#id
  }

  get name() {
    return this.#name
  }

  get cash() {
    return this.#cash
  }

  get cards() {
    return this.#playerCards
  }

  addCard(card) {
    this.#playerCards = [...this.#playerCards, card]
  }

  addCash(amount) {
    this.#cash += amount
  }

  deductCash(amount) {
    this.#cash -= amount
  }
}
