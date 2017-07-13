## Spot-Finder REST API

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

  Authorization header

  Provide username and password as JSON

This route will require an authorization header that needs to include the `username:password` of the specific user to be authenticated. Signing in will return a brand new token.

Example response:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJkOWViZjM4ODRmODFkNjg4NWMxZTljNjhkYWYwOTI3NmYxMzhhODcxZjZkZmM3NzIyOTc3MTdmNmJkNjFlYzQ2IiwiaWF0IjoxNDk5OTcyODg2fQ.HlPWON2qo8jzjYqt5cGBpwDr-gCKQmRJh4TOPveErmM
```

## Venue POST /api/venues

Required Data:

Provide userID

This route is used to create a venue.

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

## Event POST /api/events

Required Data:

Provide userID

This route is used to POST events.

## Event GET /api/events

Required Data:

Provide userID

This route is used to GET events.  

## Event PUT /api/events

Required Data:

Provide userID

This route is used to updates events.  

## Event DELETE /api/events

Required Data:

Provide userID

This route is used to delete events.
