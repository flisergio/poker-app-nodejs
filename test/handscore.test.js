import { expect } from 'chai'
import { BestHand, Card, Handscore } from '../index.js'

describe('Handscore', () => {
  const hex = (number) => {
    return parseInt(number, 16)
  }

  const buildCards = (cardTuples) => {
    return cardTuples.map(([suit, rank]) => new Card({ suit, rank }))
  }

  it('returns the correct score for HIGHEST_CARD', () => {
    expect(new Handscore().calculate({
      type: BestHand.HIGHEST_CARD,
      hand: buildCards([
        ['diamonds', 'ace'], ['clubs', 'jack'], ['spades', '10'], ['hearts', '8'], ['diamonds', '4']
      ])
    })).to.be.equal(hex('10000C'))

    expect(new Handscore().calculate({
      type: BestHand.HIGHEST_CARD,
      hand: buildCards([
        ['hearts', '9'], ['clubs', '7'], ['spades', '5'], ['hearts', '3'], ['diamonds', '2']
      ])
    })).to.be.equal(hex('100007'))
  })

  it('returns the correct score for PAIR', () => {
    expect(new Handscore().calculate({
      type: BestHand.PAIR,
      hand: buildCards([
        ['diamonds', 'king'], ['clubs', 'king'], ['spades', '10'], ['hearts', '8'], ['diamonds', '4']
      ])
    })).to.be.equal(hex('2000BB'))

    expect(new Handscore().calculate({
      type: BestHand.PAIR,
      hand: buildCards([
        ['hearts', '3'], ['spades', '3'], ['spades', '10'], ['hearts', '7'], ['diamonds', '4']
      ])
    })).to.be.equal(hex('200011'))
  })

  it('returns the correct score for TWO_PAIRS', () => {
    expect(new Handscore().calculate({
      type: BestHand.TWO_PAIRS,
      hand: buildCards([
        ['hearts', '10'], ['diamonds', '10'], ['spades', '8'], ['clubs', '8'], ['hearts', '7'],
      ])
    })).to.be.equal(hex('388665'))

    expect(new Handscore().calculate({
      type: BestHand.TWO_PAIRS,
      hand: buildCards([
        ['hearts', 'jack'], ['diamonds', 'jack'], ['diamonds', '6'], ['clubs', '6'], ['hearts', '7'],
      ])
    })).to.be.equal(hex('399445'))
  })

  it('returns the correct score for THREE_OF_A_KIND', () => {
    expect(new Handscore().calculate({
      type: BestHand.THREE_OF_A_KIND,
      hand: buildCards([
        ['hearts', '7'], ['diamonds', '7'], ['spades', '7'], ['clubs', 'queen'], ['hearts', '2'],
      ])
    })).to.be.equal(hex('4555A0'))
  })

  it('returns the correct score for STRAIGHT', () => {
    expect(new Handscore().calculate({
      type: BestHand.STRAIGHT,
      hand: buildCards([
        ['hearts', '7'], ['diamonds', '6'], ['spades', '5'], ['clubs', '4'], ['hearts', '3'],
      ])
    })).to.be.equal(hex('554321'))
  })

  it('returns the correct score for FLUSH', () => {
    expect(new Handscore().calculate({
      type: BestHand.FLUSH,
      hand: buildCards([
        ['clubs', 'ace'], ['clubs', 'king'], ['clubs', '10'], ['clubs', '8'], ['clubs', '7'],
      ])
    })).to.be.equal(hex('6CB865'))
  })

  it('returns the correct score for FULL_HOUSE', () => {
    expect(new Handscore().calculate({
      type: BestHand.FULL_HOUSE,
      hand: buildCards([
        ['clubs', 'ace'], ['clubs', 'ace'], ['diamonds', 'ace'], ['spades', '3'], ['clubs', '3'],
      ])
    })).to.be.equal(hex('7CCC11'))
  })

  it('returns the correct score for FOUR_OF_A_KIND', () => {
    expect(new Handscore().calculate({
      type: BestHand.FOUR_OF_A_KIND,
      hand: buildCards([
        ['hearts', 'queen'], ['diamonds', 'queen'], ['spades', 'queen'], ['clubs', 'queen'], ['hearts', '7'],
      ])
    })).to.be.equal(hex('8AAAA5'))
  })

  it('returns the correct score for STRAIGHT_FLUSH', () => {
    expect(new Handscore().calculate({
      type: BestHand.STRAIGHT_FLUSH,
      hand: buildCards([
        ['hearts', 'jack'], ['hearts', '10'], ['hearts', '9'], ['hearts', '8'], ['hearts', '7']
      ])
    })).to.be.equal(hex('998765'))
  })

  it('returns the correct score for ROYAL_FLUSH', () => {
    expect(new Handscore().calculate({
      type: BestHand.ROYAL_FLUSH,
      hand: buildCards([
        ['spades', 'ace'], ['spades', 'king'], ['spades', 'queen'], ['spades', 'jack'], ['spades', '10']
      ])
    })).to.be.equal(hex('ACBA98'))
  })
})
