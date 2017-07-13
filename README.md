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
Example token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJiOTAxY2YzZTAwNTE2Y2I0Mzg3Y2E3NGQwMGY5NWJjZjE4ZDQ0NzAyOTc4NmI2ZjVlYzE2ZWNiZmU3NmY2NmZmIiwiaWF0IjoxNDk5OTcwNzU4fQ.uATRkaPntQVETY-OaC2TgtLEbqxjGB4_zGebPsNqZPo
```


## User GET /api/signin

Required Data:

  Authorization header

  Provide username and password as JSON

This route will require an authorization header that needs to include the username:password of the specific user to be authenticated. Signing in will return a brand new token.



## Event GET /api/events

Required Data:

Provide userID

This route is used to query a page of events

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
