const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const expect = require('expect')
const superagent = require('superagent')

const server = require('../lib/server.js')

const ROOT_URL = `http://localhost:${process.env.PORT}`

describe('Testing user routes', () => {
  before(server.start)
  after(server.stop)

  describe('Testing Post Controller', () => {
    it('Should create user Auth and return 200 status', () => {
      return superagent.post(`${ROOT_URL}/api/users`)
        .send({})
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
