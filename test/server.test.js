const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const expect = require('expect')
const superagent = require('superagent')

const server = require('../lib/server.js')

const ROOT_URL = `http://localhost:${process.env.PORT}`

describe('server test', () => {

  it('should work', () => {
    return server.start()
      .then(() => server.start())
      .catch((err) => expect(err.message).toEqual('server already running'))
  })

  it('should respond 404 to a bad url', () => {
    return superagent.get(`${ROOT_URL}/api/no-such-route`)
      .catch(err => expect(err.status).toEqual(404))
  })

  it('should stop', () => {
    return server.stop()
      .then(() => server.stop())
      .catch((err) => expect(err.message).toEqual('server not running'))
  })

})
