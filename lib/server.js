'use strict'

const express =  require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')

mongoose.Promise = Promise

const app = express()

app.use(morgan('dev'))

app.all('/api/*', (req, res) => {
  res.sendStatus(404)
})

module.exports = {
  isOn: false,
  start: function() {
    return new Promise((resolve, reject) => {
      if(this.isOn) {
        reject(new Error('server already running'))
      }
      this.http = app.listen(process.env.PORT, (err) => {
        if(err) reject(err)
        this.isOn = true
        console.log(`server is running on port ${process.env.PORT}`)
        resolve()
      })
    })
    .then(() => mongoose.connect(process.env.MONGODB_URI))
  },
  stop: function() {
    return new Promise((resolve, reject) => {
      if(this.http && this.isOn) {
        this.isOn = false
        console.log('Stopping server')
        this.http.close((err) => {
          if(err) reject(err)
          this.isOn = false
          console.log('server stopped')
          resolve()
        })
      }
      reject(new Error('server not running'))
    })
    .then(() => mongoose.disconnect())
  },
}
