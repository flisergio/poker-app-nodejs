import { expect } from 'chai'
import { Player } from '../index.js'

describe('Player', () =>  {
  describe('constructor()', () => {
    it('should create an instance', () => {
      const player = new Player({ id: 'al-capone', name: 'Al-Capone', cash: 100})
      expect(player).to.be.an.instanceof(Player)
    })
  })

  describe('instance', () => {
    it('should have the properties', () => {
      const player = new Player({ id: 'al-capone', name: 'Al-Capone', cash: 100})
      expect(player.id).to.be.equal('al-capone')
      expect(player.name).to.be.equal('Al-Capone')
      expect(player.cash).to.be.equal(100)
    })
  })
})
