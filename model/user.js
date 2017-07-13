'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  passHash: {type: String, required: true},
  tokenSeed: {type: String, required: true, unique: true},
})

userSchema.methods.createPassHash = function(pass) {
  return bcrypt.hash(pass, 8)
    .then(hash => {
      this.passHash = hash
      return this
    })
}

userSchema.methods.passHashCompare = function(pass) {
  return bcrypt.compare(pass, this.passHash)
    .then(match => {
      if(match) {
        return this
      }
      throw new Error('Password does not match!')
    })
}

userSchema.methods.createTokenSeed = function() {
  return new Promise((resolve, reject) => {
    let attempts = 1
    let firstSeedCreate = () => {
      this.tokenSeed = crypto.randomBytes(32).toString('hex')
      this.save()
        .then(() => {
          resolve(this)
        })
        .catch(
          /* this code would only run if our 32 random bytes match another 32 random bytes in the db */
          /* this is incredibly unlikely unless we run tests with millions/billions of users,
             and we cannot force this condition to happen,
             so we ignore it for code coverage purposes. */
          /* istanbul ignore next */
          () => {
            if(attempts < 1) {
              return reject(new Error('booya Could not create token seed'))
            }
            attempts--
            firstSeedCreate()
          })
    }
    firstSeedCreate()
  })
}

userSchema.methods.createToken = function() {
  return this.createTokenSeed()
    .then(() => {
      return jwt.sign({tokenSeed: this.tokenSeed}, process.env.APP_SECRET)
    })
}

const User = module.exports = mongoose.model('authInfo', userSchema)

User.create = function(data) {
  let pass = data.pass
  delete data.pass
  return new User(data).createPassHash(pass)
    .then(user => user.createToken())
}
