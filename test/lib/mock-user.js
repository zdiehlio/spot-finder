'use strict'

const faker = require('faker')
const User = require('../../model/user.js')

const mockUser = module.exports = {}

mockUser.createOne = () => {
  let result = {}
  result.pass = faker.internet.password()
  return new User()
    .createPassHash(result.pass)
    .then(user => {
      result.user = user
      user.createToken()
      return user
    })
    // .then(token => {
    //   result.token = token
    //   return result
    // })
}
