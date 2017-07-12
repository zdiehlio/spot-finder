##Spot-Finder REST API

##Overview
This RESTful API was created to help people find and post venue for meetup or events, When a user signup they create a profile where he can decide to either look for venue or post his venue for other user to find and use. When a user sign up a venue owner they can list there venue for other to use they have the option to upload capacity size, amenities, images, price.

This RESTful API provides the necessary back-end infrastructure and functionality to create, read, update and delete data related to match user with venues. This API provides a means for user to connect to available venues.

##########
##Routes

##User POST /api/signup

Required Data:

Provide username, password as JSON

This route will create a new user by providing a username, password in the body of the request. Creating a new user is required to store and access data later. This route must be completed before attempting to use the api/signin route.

{"username": "ChrisTech", "password": "myplaintextpassword"}

A token will be returned that will only be used for the api/signin route.


##User GET /api/signin

Required Data:

  Authorization header

  Provide username and password as JSON

This route will require an authorization header that needs to include the username:password of the specific user to be authenticated. Signing in will return a brand new token.

## Profile POST /api/profile

Required Data:

Provide username as JSON

This route will create a new Profile with username, userID and option to add venueID and eventID.

## Profile GET /api/profile

Required Data:

Provide userID

This route is used to retrieve the profile using the userID.


##Profile PUT /api/profile

Required Data:

Provide userID

This route is used to retrieve a profile by using the userID and updated the profile.


##Profile DELETE /api/profile

Required Data:

Profile userID

This route is used to retrieve a profile by userID and delete the profile.
