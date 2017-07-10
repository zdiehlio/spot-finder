const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const expect = require('expect')
const superagent = require('superagent')


const ROOT_URL = `http://localhost:${process.env.PORT}`
const server = require('../lib/server.js')

describe('start server', () => {
  before(server.start)
  after(server.stop)

  describe('testing POST /api/profile', () => {
    it('should respond with a profile', () => {
      return superagent.post(`${ROOT_URL}/api/profile`)
        .send()
        .end(res => {
          expect(res.status).toEqual(200)
          expect(res.body.username).toEqual(' ')
          expect(res.body._id).toExist()
        })
    })

    it('should respond with 400 invalid request body', () => {
      return superagent.post(`${ROOT_URL}/api/profile`).send().catch(err => {
        expect(err.status).toEqual(404)
      })
    })
  })

})
