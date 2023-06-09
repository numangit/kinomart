# KinoMart Server
KinoMart is a full-stack E-commerce website.
<!-- 
## Live Server link
Hosted on Firebase -> [Click here](https://woodpecker-12.web.app/) -->

## Server Features

* error handling
* limit to API call rate
* Model-View-Controller (MVC) Architecture
* Schema and Models
* Schema Validation, password encryption
* Seeding API (for testing and initial data inserting)
* Pagination & search functionality
* Response controller for error and success
* Services (to avoid code repetition)
* CRUD operations

## Packages used in the server

* express
* error handling -> http-errors
* to sanitize user input  -> xss-clean
* to set limit to API calls -> express-rate-limit
* mongoose -> to connect with mongodb
* bcrypt -> to encrypt and decrypt passwords

## devDependencies packages

* morgan
* nodemon