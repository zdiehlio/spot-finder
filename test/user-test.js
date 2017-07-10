const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const expect = require('expect')
const superagent = require('superagent')
const User = require('../model/user.js')

const server = require('../lib/server.js')

const ROOT_URL = `http://localhost:${process.env.PORT}`

describe('Testing User', () => {
  console.log('Testing')
  before(server.start)
  after(server.stop)

  describe('Testing user constructor', () => {
    it.only('Should create user Auth and return 200 status', () => {
      return superagent.post(`${ROOT_URL}/api/users`)
        .send(new User())
        .then(res => {
          expect(res.body.tokenSeed).toExist()
          expect(res.body.passwordHash).toExist()
        })
    })
    it('Should respond with status of 400', () => {
      return superagent.post(`${ROOT_URL}/api/users`)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })
  })
})
