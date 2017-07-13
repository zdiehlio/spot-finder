'use strict'

const dotenv = require('dotenv')
dotenv.config({path: `${__dirname}/../.test.env`})

const expect = require('expect')
const superagent = require('superagent')

const server = require('../lib/server.js')
// const User = require('../model/user.js')
const mockUser = require('./lib/mock-user.js')

const ROOT_URL = `http://localhost:${process.env.PORT}`

describe('Testing user routes', () => {
  before(server.start)
  after(server.stop)

  describe('testing Post route', () => {
    it('Should create a user and authenticate', () => {
      return superagent.post(`${ROOT_URL}/api/signup`)
        .send({username: 'awesome', pass: '12345'})
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.text).toExist()
        })
    })
    it('should return 401 error', () => {
      return superagent.post(`${ROOT_URL}/api/signup`)
        .send({})
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })
  })
  describe('Testing GET request', () => {
    it('Should return a status of 200', () => {
      let testUser
      return mockUser.createOne()
        .then(userData => {
          testUser = userData.user
          let encoded = new Buffer(`${testUser.username}:${userData.pass}`).toString('base64')
          return superagent.get(`${ROOT_URL}/api/signin`)
            .set('Authorization', `Basic ${encoded}`)
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.text).toExist()
        })
    })
    it('should respond 401 when trying to log in with empty basic auth', () => {
      return superagent.get(`${ROOT_URL}/api/signin`)
        .set('Authorization', `Basic `)
        .catch(err => expect(err.status).toEqual(401))
    })
    it('should respond 401 with an empty password', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`${userData.user.username}:`).toString('base64')
          return superagent.get(`${ROOT_URL}/api/signin`)
            .set('Authorization', `Basic ${encoded}`)
        })
        .catch(err => expect(err.status).toEqual(401))
    })

    it('should respond 401 with an incorrect password', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`${userData.user.username}:hunter2`).toString('base64')
          return superagent.get(`${ROOT_URL}/api/signin`)
            .set('Authorization', `Basic ${encoded}`)
        })
        .catch(err => expect(err.status).toEqual(401))
    })

    it('Should return a status of 401', () => {
      return superagent.get(`${ROOT_URL}/api/signin`)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })
  })
})
