const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const expect = require('expect')
const superagent = require('superagent')
const server = require('../lib/server.js')
const Profile = require('../model/profile.js')


const ROOT_URL = `http://localhost:${process.env.PORT}`

describe('start server', () => {
  before(server.start)
  after(server.stop)

  describe('testing POST /api/profile', () => {
    it('should respond with a profile', () => {
      return superagent.post(`${ROOT_URL}/api/profile`)
        .send({username: 'hello'})
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.username).toEqual('hello')
          expect(res.body._id).toExist()
        })
    })

    it('should respond with 400 invalid request body', () => {
      return superagent.post(`${ROOT_URL}/api/profile`)
        .send({username: 34443})
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })
  })

  describe('testing GET /api/profile/:id', () => {
    var tempProfile
    afterEach(() => Profile.remove({}))
    beforeEach(() => {
      return new Profile({
        username: 'helloworld',
      })
        .save()
        .then(profile => {
          tempProfile = profile
        })
    })

    it('should respond with a profile', () => {
      console.log('tempProfile', tempProfile)
      return superagent.get(`${ROOT_URL}/api/profile/${tempProfile._id}`)
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body._id).toEqual(tempProfile._id)
          expect(res.body.username).toEqual(tempProfile.username)
        })
    })
    describe('testing PUT /api/profile', () => {
      it('Should respond 200 with the updated profile', () => {
        return superagent.put(`${ROOT_URL}/api/profile/${tempProfile._id}`)
          .send({username: 'Hawk'})
          .then(res => {
            expect(res.status).toEqual(200)
            expect(res.body.username).toEqual('Hawk')
          })
      })
    })

    describe('testing DELETE /api/profile/:id', () => {
      afterEach(() => Profile.remove({}))
      beforeEach(() => {
        return new Profile({
          username: 'helloworld',
        })
          .save()
          .then(profile => {
            tempProfile = profile
          })
      })

      it('should delete a profile', () => {
        console.log('tempProfile', tempProfile)
        return superagent.delete(`${ROOT_URL}/api/profile/${tempProfile._id}`)
          .then(res => {
            expect(res.status).toEqual(204)
          })
      })

      it('bad id should respond with a 404', () => {
        console.log('tempProfile', tempProfile)
        return superagent.delete(`${ROOT_URL}/api/profile/5965322b96a28124e0cb4a00`)
          .catch(res => {
            expect(res.status).toEqual(404)
          })
      })
    })
  })
})
