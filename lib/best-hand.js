export default class BestHand {
  static HIGHEST_CARD = 'HIGHEST_CARD'
  static PAIR = 'PAIR'
  static TWO_PAIRS = 'TWO_PAIRS'
  static THREE_OF_A_KIND = 'THREE_OF_A_KIND'
  static STRAIGHT = 'STRAIGHT'
  static FLUSH = 'FLUSH'
  static FULL_HOUSE = 'FULL_HOUSE'
  static FOUR_OF_A_KIND = 'FOUR_OF_A_KIND'
  static STRAIGHT_FLUSH = 'STRAIGHT_FLUSH'
  static ROYAL_FLUSH = 'ROYAL_FLUSH'
  #cards
  #cardsByRanks = null
  #cardsBySuits = null

  constructor(playerCards, communityCards) {
    this.#cards = [...playerCards, ...communityCards].sort((card1, card2) => {
      return card2.compareTo(card1)
    })
    this.#groupCardsByRanks()
    this.#groupCardsBySuits()
  }

  determine() {
    return this.#royalFlush()
      || this.#straightFlush()
      || this.#fourOfAKind()
      || this.#fullHouse()
      || this.#flush()
      || this.#straight()
      || this.#threeOfAKind()
      || this.#twoPairs()
      || this.#pair()
      || this.#highestCard()
  }

  #royalFlush() {
    const flushCards = this.#atLeastXOfASuit(5)
    if (!flushCards.length > 0) return null
    const suit = flushCards[0][0]
    const royalFlushCards = this.#possibleStraights()[0].reduce((cards, rank) => {
      const foundCards = this.#cards.filter((c) => c.rank === rank)
        return [...cards, ...foundCards]
    }, []).filter((c) => c.suit === suit)
    return royalFlushCards.length === 5 ? {
      type: BestHand.ROYAL_FLUSH,
      hand: royalFlushCards
    }  : null
  }

  #straightFlush() {
    const flushCards = this.#atLeastXOfASuit(5)
    if (!flushCards.length > 0) return null
    const suit = flushCards[0][0]
    const straightFlushCards = this.#possibleStraights().map((straightVariant) => {
      return straightVariant.reduce((cards, rank) => {
        const foundCards = this.#cards.filter((c) => c.rank === rank)
        return [...cards, ...foundCards]
      }, [])
    })
    .map((cardList) => {
      const cardListWithSuit = cardList.filter((c) => c.suit === suit)
      return [cardListWithSuit.length, cardListWithSuit]
    })
    .filter(([length]) => length >= 5)

    return straightFlushCards.length ? {
      type: BestHand.STRAIGHT_FLUSH,
      hand: straightFlushCards[0][1]
    }  : null
  }

  #fourOfAKind() {
    const fourOfAKind = this.#xOfAKind(4)
    return fourOfAKind.length ? {
      type: BestHand.FOUR_OF_A_KIND,
      hand: this.#fillUpWithHighestCards(fourOfAKind[0][1])
    }  : null
  }

  #fullHouse() {
    const pairs = this.#xOfAKind(2)
    const threeOfAKind = this.#xOfAKind(3)
    return threeOfAKind.length && pairs.length ? {
      type: BestHand.FULL_HOUSE,
      hand: [...threeOfAKind[0][1], ...pairs[0][1]]
    } : null
  }

  #flush() {
    const cardsOfASuit = this.#atLeastXOfASuit(5)

    return cardsOfASuit.length ? {
      type: BestHand.FLUSH,
      hand: cardsOfASuit.slice(0, 5)[0][1]
    } : null
  }

  #straight() {
    const straightCards = this.#possibleStraights().map((straightVariant) => {
      return straightVariant.reduce((cards, rank) => {
        const card = this.#cards.find((c) => c.rank === rank)
        if (card) return [...cards, card]
        return cards
      }, [])
    }).filter((cards) => cards.length === 5)

    return straightCards.length ? {
      type: BestHand.STRAIGHT,
      hand: straightCards[0]
    } : null
  }

  #threeOfAKind() {
    const threeOfAKind = this.#xOfAKind(3)
    return threeOfAKind.length ? {
      type: BestHand.THREE_OF_A_KIND,
      hand: this.#fillUpWithHighestCards(threeOfAKind[0][1])
    } : null
  }

  #twoPairs() {
    const pairs = this.#xOfAKind(2)
    return pairs.length >= 2 ? {
      type: BestHand.TWO_PAIRS,
      hand: this.#fillUpWithHighestCards([...pairs[0][1], ...pairs[1][1]])
    } : null
  }

  #pair() {
    const pairs = this.#xOfAKind(2)
    return pairs.length ? {
      type: BestHand.PAIR,
      hand: this.#fillUpWithHighestCards(pairs[0][1])
    } : null
  }

  #xOfAKind(number) {
    return [...this.#cardsByRanks.entries()].filter(([, cards]) => {
      return cards.length == number
    })
  }

  #atLeastXOfASuit(number) {
    return [...this.#cardsBySuits.entries()].filter(([, cards]) => {
      return cards.length >= number
    })
  }

  #highestCard() {
    return {
      type: BestHand.HIGHEST_CARD,
      hand: this.#cards.slice(0, 5)
    }
  }

  #groupCardsBySuits() {
    this.#cardsBySuits = this.#groupCardsByType('suit')
  }

  #groupCardsByRanks() {
    this.#cardsByRanks = this.#groupCardsByType('rank')
  }

  #groupCardsByType(type) {
   return this.#cards.reduce((map, card) => {
      if (map.has(card[type])) {
        const cards = map.get(card[type])
        map.set(card[type], [...cards, card])
      } else {
        map.set(card[type], [card])
      }
      return map
    }, new Map())
  }

  #possibleStraights() {
    return [
      ['ace', 'king', 'queen', 'jack', '10'],
      ['king', 'queen', 'jack', '10', '9'],
      ['queen', 'jack', '10', '9', '8'],
      ['jack', '10', '9', '8', '7'],
      ['10', '9', '8', '7', '6'],
      ['9', '8', '7', '6', '5'],
      ['8', '7', '6', '5', '4'],
      ['7', '6', '5', '4', '3'],
      ['6', '5', '4', '3', '2'],
    ]
  }

  #fillUpWithHighestCards = (relevantCards) => {
    const remainingCards = this.#cards.filter((card) => {
      return !relevantCards.find((relevantCard) => {
        return relevantCard.suit === card.suit && relevantCard.rank === card.rank
      })
    })
    return [...relevantCards, ...remainingCards.slice(0, 5 - relevantCards.length)]
  }
}
