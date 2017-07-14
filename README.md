# Spot-Finder REST API

## Overview
This RESTful API was created to help people find and post venue for meetup or events, When a user signup they create a profile where he can decide to either look for venue or post his venue for other user to find and use. When a user sign up a venue owner they can list there venue for other to use they have the option to upload capacity size, amenities, images, price.

This RESTful API provides the necessary back-end infrastructure and functionality to create, read, update and delete data related to match user with venues. This API provides a means for user to connect to available venues.

****
## Routes

## User POST /api/signup

Required Data:

Provide username, password as JSON

This route will create a new user by providing a username, password in the body of the request. Creating a new user is required to store and access data later. This route must be completed before attempting to use the api/signin route.

{"username": "ChrisTech", "password": "myplaintextpassword"}

A token will be returned that will only be used for the api/signin route.

Example response (token):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJiOTAxY2YzZTAwNTE2Y2I0Mzg3Y2E3NGQwMGY5NWJjZjE4ZDQ0NzAyOTc4NmI2ZjVlYzE2ZWNiZmU3NmY2NmZmIiwiaWF0IjoxNDk5OTcwNzU4fQ.uATRkaPntQVETY-OaC2TgtLEbqxjGB4_zGebPsNqZPo
```


## User GET /api/signin

Required Data:

  * Authorization header

  * Provide username and password as JSON

This route will require an authorization header that needs to include the `username:password` of the specific user to be authenticated. Signing in will return a brand new token.

Example response:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJkOWViZjM4ODRmODFkNjg4NWMxZTljNjhkYWYwOTI3NmYxMzhhODcxZjZkZmM3NzIyOTc3MTdmNmJkNjFlYzQ2IiwiaWF0IjoxNDk5OTcyODg2fQ.HlPWON2qo8jzjYqt5cGBpwDr-gCKQmRJh4TOPveErmM
```
## Venue GET /api/venues

This route will return one page  with a list of 20 venue if no query is provide it will return a page of venues in alphabetical order by default.

Example Venue:

```
{ name: 'Gibson - Dickens',
 address: '89099 Lemke Locks',
 capacity: 21,
 amenities:
  [ 'mission-critical productize mindshare',
    'end-to-end iterate e-commerce',
    'viral orchestrate web services' ],
 description: 'Eum ut eos quos possimus qui perspiciatis.',
 images: [],
 price: 0,
 owner: null,
 events: [] }

```


## Venue POST /api/venues

Venue Data:

* Required in the body of request:
  * name: 'example name'
  * address: 'example address'
  * capacity: 'example capacity'

* Optional data:
  * amenities: 'example amenities'
  * description: 'example description'
  * images: 'example images'
  * price: 'example price',

* Authorization Header
  * `Bearer <response token from signin>`

This route is used to create a venue, A venue will be created  once a user's token is verified. when creating venue you provide information about the venue like name, address, capacity, amenities, description and images.

Example Venue:

```
{ name: 'The Dawg Star Bar',
 address: '89099 Lemke Locks',
 capacity: 30,
 amenities:
  [ 'Bar Food',
    'multiple outlet for computers',
    'WIFI' ],
 description: 'The Dawg Star Bar is a perfect bar for weddings and banquets.  It has full ABC permits and can offer many beverage alternatives for you and your guests. This space optionally adjoins with the main Dining Room and Library, providing easy access to the Terrace and Lawn. The Bar itself features a custom granite countertop that can also be used as a buffet or hors d’oeuvres serving station.  The bar seats up to 30 people.',
 images: [],
 price: 0,
 owner: null,
 events: [] }
```
## PUT /api/venues/:id
Venue Data:

* Required in the body of request:
  * name: 'example name'
  * address: 'example address'
  * capacity: 'example capacity'

* Authorization Header
  * `Bearer <response token from signin>`

Required in the query:

Specific venue id which is provided when you complete a post request to `api/venues`

This route will allow you to update the venue.

Example response:

```
{ name: 'Gibson - Dickens',
 address: '89099 Lemke Locks',
 capacity: 21,
 amenities:
  [ 'mission-critical productize mindshare',
    'end-to-end iterate e-commerce',
    'viral orchestrate web services' ],
 description: 'Eum ut eos quos possimus qui perspiciatis.',
 images: [],
 price: 0,
 owner: null,
 events: [] }

```
## Venue DELETE /api/venues/:id

Required in the query:

Specific event id which is provided when you complete a post request to `api/venues`

This route will allow you to delete specific venue by their id.

Example response: You will only receive a status code 204 when a successful deletion occurs.

## Event GET /api/events

This route will return one page  with a list of 20 venue if no query is provide it will return a page of venues in alphabetical order by default.

Example Event:

```
{ name: 'cyan, mission-critical scale',
  start: moment("2017-07-16T04:39:13.204"),
  end: moment("2017-07-17T00:39:13.204"),
  numberOfPeople: 181,
  venue: null,
  owner: null }
```
## Event POST /api/events

Event data:

* Required in the body of request:
  * name: 'example name'
  * start: 'example moment'
  * end: 'example moment'
  * numberOfPeople: 'example numberOfPeople'

* Authorization:
  *  `Bearer <response token from signin>`

This route will create a new event that will include the name of the event and date. userId is required and is used to tie the user to the new event.

Example event:
```
{ name: 'ivory, B2B repurpose',
  start: moment("2017-07-23T10:40:04.016"),
  end: moment("2017-07-23T18:40:04.016"),
  numberOfPeople: 15,
  venue: null,
  owner: null }
```

## Event PUT /api/events

Event data:

* Required in the body of request:
  * name: 'example name'
  * start: 'example moment'
  * end: 'example moment'
  * numberOfPeople: 'example numberOfPeople'

* Authorization:
  *  `Bearer <response token from signin>`

Required in the query:

Specific event id which is provided when you complete a post request to `api/events`

This route is used to updates events.  

Example event:
```
{ name: 'ivory, B2B repurpose',
  start: moment("2017-07-23T10:40:04.016"),
  end: moment("2017-07-23T18:40:04.016"),
  numberOfPeople: 15,
  venue: null,
  owner: null }
```

## Event DELETE /api/events/:id

Required in the query:

Specific event id which is provided when you complete a post request to `api/events`

This route will allow you to delete specific event by their id.

Example response: You will only receive a status code 204 when a successful deletion occurs.

***
# Testing

## Testing Framework mocha test runner
eslint

## Travis
Continuous Integration travis-ci is integrated into this project through the use of the included .travis.yml file. All pull requests initiated in git will launch travis, which in turn runs the included mocha tests and the eslint tests. Pull requests are not merged until all travis-ci tests pass.
