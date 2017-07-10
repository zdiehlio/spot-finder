require('dotenv').config({ path: `${__dirname}/../.test.env` })
const expect = require('expect')
const superagent = require('superagent')
const API_URL = process.env.API_URL
describe('testing POST /api/profile', () => {

  it('should respond with a profile', () => {
    return superagent.post(`${API_URL}/api/profile`)
      .send()
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.username).toEqual(' ')
        expect(res.body._id).toExist()
      })
  })

  it('should respond with 400 invalid request body', () => {
    return superagent.post(`${API_URL}/api/profile`).send().catch(err => {
      expect(err.status).toEqual(400)
    })
  })
})
