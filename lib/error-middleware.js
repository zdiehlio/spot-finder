'use strict'

module.exports = (err, req, res, next) => {//eslint-disable-line
  //console.error('error message in error middleware')
  //console.log(err)
  // if validation error respond with 400
  if(err.message.toLowerCase().includes('validation failed'))
    return res.sendStatus(400)

  if(err.message.toLowerCase().includes('data and salt arguments'))
    return res.sendStatus(401)

  if(err.message.toLowerCase().includes('no authorization provided'))
    return res.sendStatus(401)

  if(err.message.toLowerCase().includes('no headers provided'))
    return res.sendStatus(401)

  if(err.message.toLowerCase().includes('no token'))
    return res.sendStatus(401)

  if(err.message.toLowerCase().includes('forbidden'))
    return res.sendStatus(403)

  // if duplacte key respond with 409
  if(err.message.toLowerCase().includes('duplicate key'))
    return res.sendStatus(409)

  if(err.message.toLowerCase().includes('objectid failed'))
    return res.sendStatus(404)

  // errors relating to event scheduling
  if(err.message.toLowerCase().includes('no such venue'))
    return res.sendStatus(400)

  if(err.message.toLowerCase().includes('bad times'))
    return res.sendStatus(400)

  if(err.message.toLowerCase().includes('venue is already booked'))
    return res.sendStatus(409)

  res.sendStatus(500)
}
