import { expect } from 'chai'
import { Card, Player, Winners } from '../index.js'

describe('Winners', () => {
  const buildCards = (cardTuples) => {
    return cardTuples.map(([suit, rank]) => new Card({ suit, rank }))
  }

  const json = (cardTuples) => {
    return JSON.stringify(cardTuples)
  }

  const jsonCards = (cardTuples) => {
    return JSON.stringify(buildCards(cardTuples))
  }

  const buildPlayerAndPlayerCards = (handCardTuples, id = 'al-capone') => {
    const player = new Player({ id, name: 'Al Capone', cash: 95 })
    const cards = handCardTuples.map(([suit, rank]) => new Card({ suit, rank }))
    return [player, cards]
  }

  it('returns a list of players with their winning hands', () => {
      const [player1, cards1] = buildPlayerAndPlayerCards([['spades', '2'], ['diamonds', '10']])
      const communityCards = buildCards([
        ['diamonds', 'ace'], ['clubs', 'ace'], ['spades', 'king'], ['hearts', 'king'], ['clubs', 'king']
      ])
      const winners = new Winners([player1], [cards1], communityCards).determine()
      expect(winners).to.deep.equal([{
        winner: player1,
        winningHand: communityCards
      }])
  })

  it('returns a winner with the winning hand', () => {
    const [player1, cards1] = buildPlayerAndPlayerCards([['spades', '2'], ['diamonds', '5']])
    const [player2, cards2] = buildPlayerAndPlayerCards([['spades', 'ace'], ['diamonds', '4']], 'pat-garret')
    const communityCards = buildCards([
      ['diamonds', '3'], ['clubs', '6'], ['spades', '7'], ['hearts', 'queen'], ['diamonds', '10']
    ])
    const winners = new Winners([player1, player2], [cards1, cards2], communityCards).determine()

    expect(winners.length).to.equal(1)
    const [{ winner, winningHand }] = winners
    expect(winner.id).to.be.equal('pat-garret')
    expect(winningHand).to.include.deep.members(buildCards([
      ['spades', 'ace'], ['hearts', 'queen'], ['diamonds', '10'], ['spades', '7'], ['clubs', '6']
    ]))
  })

  it('returns all winners if both have the same pair rank', () => {
    const [player1, cards1] = buildPlayerAndPlayerCards([['spades', 'jack'], ['diamonds', '5']])
    const [player2, cards2] = buildPlayerAndPlayerCards([['spades', 'ace'], ['diamonds', 'jack']], 'pat-garret')
    const [player3, cards3] = buildPlayerAndPlayerCards([['clubs', 'king'], ['hearts', 'jack']], 'doc-holiday')
    const communityCards = buildCards([
      ['diamonds', '3'], ['clubs', '6'], ['spades', '7'], ['hearts', 'queen'], ['clubs', 'jack']
    ])
    const winners = new Winners([player1, player2, player3], [cards1, cards2, cards3], communityCards).determine()

    expect(winners.length).to.equal(3)
    expect(winners[0].winner.id).to.be.equal('al-capone')
    expect(winners[1].winner.id).to.be.equal('pat-garret')
    expect(winners[2].winner.id).to.be.equal('doc-holiday')
    expect(json(winners[0].winningHand)).to.equal(jsonCards([
      ['spades', 'jack'], ['clubs', 'jack'], ['hearts', 'queen'], ['spades', '7'], ['clubs', '6']
    ]))
    expect(json(winners[1].winningHand)).to.equal(jsonCards([
      ['diamonds', 'jack'], ['clubs', 'jack'], ['spades', 'ace'], ['hearts', 'queen'], ['spades', '7']
    ]))
    expect(json(winners[2].winningHand)).to.equal(jsonCards([
      ['hearts', 'jack'], ['clubs', 'jack'], ['clubs', 'king'], ['hearts', 'queen'], ['spades', '7']
    ]))
  })

  it('returns a winner among 2 players with fullhouse and threeofkind hand', () => {
    const [player1, cards1] = buildPlayerAndPlayerCards([['spades', 'jack'], ['diamonds', 'jack']])
    const [player2, cards2] = buildPlayerAndPlayerCards([['hearts', 'jack'], ['diamonds', '4']], 'pat-garret')

    const communityCards = buildCards([
      ['diamonds', '3'], ['clubs', '6'], ['clubs', 'jack'], ['hearts', '5'], ['diamonds', '5']
    ])
    const winners = new Winners([player1, player2], [cards1, cards2], communityCards).determine()

    expect(winners.length).to.equal(1)
    const [{ winner, winningHand }] = winners
    expect(winner.id).to.be.equal('al-capone')
    expect(json(winningHand)).to.equal(jsonCards([
      ['spades', 'jack'], ['diamonds', 'jack'], ['clubs', 'jack'], ['hearts', '5'], ['diamonds', '5']
    ]))
  })
})
