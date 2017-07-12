'use strict'

const express =  require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const profileRouter = require('../route/profile-route.js')
const userRouter = require('../route/user-route.js')
mongoose.Promise = Promise

const app = express()

app.use(morgan('dev'))
app.use(profileRouter)

app.use(require('../route/venue-route.js'))
app.use(require('../route/event-route.js'))
app.use(userRouter)
app.all('/api/*', (req, res) => {
  res.sendStatus(404)
})
app.use(require('./error-middleware.js'))

module.exports = {
  isOn: false,
  start: function() {
    return new Promise((resolve, reject) => {
      if(this.isOn) {
        return reject(new Error('server already running'))
      }
      this.http = app.listen(process.env.PORT, (err) => {
        if(err) return reject(err)
        this.isOn = true
        console.log(`server is running on port ${process.env.PORT}`)
        return resolve()
      })
    })
      .then(() => mongoose.connect(process.env.MONGODB_URI))
  },
  stop: function() {
    return new Promise((resolve, reject) => {
      //console.dir(this)
      if(this.http && this.isOn) {
        this.isOn = false
        console.log('Stopping server')
        return this.http.close((err) => {
          console.log('error here!!!')
          console.log(err)
          if(err) return reject(err)
          this.isOn = false
          console.log('server stopped')
          return resolve()
        })
      }
      reject(new Error('server not running'))
    })
      .then(() => mongoose.disconnect())
  },
}
