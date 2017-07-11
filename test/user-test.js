'use strict'
console.log('Test File')
const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const expect = require('expect')
const superagent = require('superagent')

const mockUser = require('./lib/mock-user.js')
const server = require('../lib/server.js')

const ROOT_URL = `http://localhost:${process.env.PORT}`

describe('Testing User', () => {
  console.log('Testing')
  before(server.start)
  after(server.stop)

  describe('Testing user constructor', () => {
    it.only('Should create user Auth and return 200 status', () => {
      // const testUserInput = ({
      //   passHash: '12345',
      // })
      return mockUser.createOne()
        .then(testUser => {
          console.log(testUser)
          expect(testUser.tokenSeed).toExist()
          expect(testUser.passHash).toExist()
        })
    })
  })
  it('Should respond with status of 400', () => {
    return superagent.post(`${ROOT_URL}/api/users`)
      .catch(res => {
        expect(res.status).toEqual(400)
      })
  })
})
