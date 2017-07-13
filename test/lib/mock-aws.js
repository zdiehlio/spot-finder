'use strict'

require('dotenv').config({path: `${__dirname}/../.test.env`})
const awsMock = require('aws-sdk-mock')

awsMock.mock('S3', 'upload', function(params, callback) {
  if(params.ACL !== 'public-read')
    return callback(new Error('ACL must be public read'))
  if(params.Bucket !== 'FAKE_BUCKET') {
    console.log(params.Bucket)
    return callback(new Error('bucket must equal fake bucket'))
  }
  if(!params.Key)
    return callback(new Error('must set key'))
  if(!params.Body)
    return callback(new Error('must set body'))

  callback(null, {
    Key: params.Key,
    Location: 'fakeaws.s3.com/FAKE_BUCKET/$(params.Key)',
  })
})

awsMock.mock('S3', 'deleteObject', function(params, callback) {
  if(!params.Key)
    return callback('must set key')
  if(params.Bucket !== 'FAKE_BUCKET')
    return callback(new Error('must equal fake bucket'))
  callback()
})
