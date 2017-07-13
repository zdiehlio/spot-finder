'use strict'
const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const expect = require('expect')

const mockUser = require('./lib/mock-user.js')
const server = require('../lib/server.js')

describe('Testing User', () => {
  before(server.start)
  after(server.stop)

  describe('Testing user constructor', () => {
    it('Should create user Auth and return 200 status', () => {
      return mockUser.createOne()
        .then(res => {
          expect(res.user.tokenSeed).toExist()
          expect(res.user.passHash).toExist()
        })
    })
  })
})
