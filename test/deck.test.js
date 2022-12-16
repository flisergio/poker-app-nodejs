import { expect } from 'chai'
import { Deck, Card } from '../index.js'

describe('Deck', function () {
  let deck = null

  beforeEach(function () {
    deck = new Deck()
  })

  describe('constructor()', function () {
    it('should create an instance', function () {
      expect(deck).to.be.an.instanceof(Deck)
    })
  })

  describe('cards', function () {
    it('should have the correct cards initially', function () {
      const numberOfCards = 52
      const expectedCards = []
      for (const suit of Card.SUITS) {
        for (const rank of Card.RANKS) {
          expectedCards.push(new Card({ suit, rank }))
        }
      }
      const { cards } = deck
      expect(cards.length).to.eql(numberOfCards)
      for (let i = 0; i < cards.length; i++) {
        const foundCard = expectedCards.find(
          ({ rank, suit }) => rank === cards[i].rank && suit === cards[i].suit
        )
        expect(foundCard).to.not.be.undefined
      }
    })
  })

  describe('draw()', function () {
    it('should draw the correct count', function () {
      const cardsBeforeDraw = [...deck.cards]
      const count = 7
      const drawnCards = deck.draw(count)
      expect(drawnCards).to.have.length(7)
      const cardsAfterDraw = [...deck.cards]
      expect(cardsAfterDraw).to.have.length(cardsBeforeDraw.length - count)
    })

    it('should throw an error when drawing invalid count', function () {
      expect(() => deck.draw(deck.cards.length + 1)).to.throw(Error, 'Not enough remaining cards')
    })
  })
})
