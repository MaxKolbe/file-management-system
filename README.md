# File Managment System (Version 1)
-Version 1 serves as the basic form of the project, with only signup/login features and document upload to the database

This is the documentation for a file management system I am building. 
It will also serve as a reservoir for documenting common errors I encounter and/or solve/ 

## Table of contents
- [Overview](#overview)
- [My Process](#my-process)
    - [Built with](#built-with)
    - [Database](#database)
- [Errors](#errors)

## Overview
The purpose of this project is to server as a file management system for a business. 
The features (will be added as I build) include:
- Uploading Files to the database
- Retrieving Files


## My Process

### Built with
-nodejs
-express
-mongodb
-Dependencies can be found in the package.json

### Database
I figured how to connect to my monggose database. 
That is: retrieve the url, and connect. 
I made sure to retrieve the correct url and end it with the database name, in this case: "FMS" i.e 'mongodb+srv://info:password@clustername.mongodb.net/FMS'
![](./public/Images/s1.png) 
![](./public/Images/s2.png) 

## Errors
1. Cannot GET/POST/PUT/DELETE
-This is probably a routing issue. Check routes, naming (ensure they end in .js)
2. ejs template cannot recognize a variable
=Send the variable as a null or empty string in the Get request i.e res.render('home', {message: null})
 
