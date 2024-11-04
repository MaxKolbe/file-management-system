# Local File Managment System (V1.1.0) Law Firm Version
This is a File Management System (FMS), built with Node.js designed to organize, manage, and facilitate access to files across multiple devices(clients) locally. It also supports file search functionality, ideal for small offices and teams. 

##  Quick-Start
-   Clone the repository, `git clone <repository-url>`
-   Navigate to the project directory and install dependencies, `npm install`
-   Run the server, `node server.js`
>   Note: This project requires a few dotenv variables.  To see what to include in your .env file click [here](#dotenv)

## Content
1.  [Overview](#overview)
2.  [Build Stack](#build-stack)
    - [Dotenv](#dotenv)
3.  [Folder Organization](#folder-organization)
4.  [Features](#features)
    - [Authentican And Authorization](#authentication-and-authorization)
5.  [Setting Up Local Server](#setting-up-local-server)
    - [Windows Task Manager](#windows-task-manager)
    - [IP Router Set-up](#ip-router-setup)

## Overview
This app is a file management system. V1.1.0 is built specifically for Law Firms, a general template version for other small businesses will be made available on another branch.

This app runs locally on the server, and uses a server's storage to store files. The files can also be downloaded on other client machines. The rest of the features will be discussed in the [Features](#features) section. 

## Build Stack
-   Node.js
-   Express 
-   Mongodb (Database)
>   Dependencies: Find a list of dependencies in the package.json file

### Dotenv
-   PORT 
    > 3000 will work fine 
-   OFFICECODE
    > Create a code for your office or team to enable only members from your office/team to sign up and access your files, e.g. `OFFICECODE = "0824635"`
-   DATABASEURL
    > Mongodb connection string
-   SECRET
    > Jwt secret. Make sure to use a long string.
-   PARENTDIR
    > Parent folder directory for file storage on your server, e.g. `PARENTDIR = "C:\Users\Username\Documents\FMS-STORAGE"`
-   EMAIL
    > Nodemailer is used in the project for sending emails. Feel free to disreqard any feature requiring emails. But provide an email that will act as a sender if you choose to use it. 
-   EPASSWORD 
    > The email password should be included
-   HOST
    > This might be required depending on your email service provider. For more details on Nodemailer visit the [Nodemailer Website](https://nodemailer.com/)

## Folder Organization
For this version (Law Firm) the folder structure follows this path: 
>   PARENT-DIRECTORY/TYPE-OF-CASE/YEAR/COURT/SUIT-NUMBER/FILE-NAME

For other versions a custom folder structure will be used

## Features
1. Home page with a list of folders that contain the documents/files. 
![](./public/Images/s3.png)
2. Download functionality available to download files. 
![](./public/Images/s4.png)
3. Search functionality. 
![](./public/Images/s5.png)
4. Upload form to upload files. 
![](./public/Images/s6.png)
5. Document/File history to see history of uploaded documents 
![](./public/Images/s7.png)
6. Edit and delete functionality for files. 
![](./public/Images/s9.png)
![](./public/Images/s8.png)

### Authentication And Authorization
This app uses the basic jwt auth strategy. 
It has 3 levels of authorization which can be customized to include more. 
1. verifyStaff

    Basic auth function to verify users are logged in and staff of the office. 
2. verifyStaffAndAdmin

    Auth function to check if user is Admin. For routes that require Admin priveledges like upload and update routes. 
3. verifyStaffAdminAndDev

    Developer route to check if user is a Developer for special routes that require dev access. Please see middleware>authenticate.js folder/file to customize the criteria for checking if user is a developer.

## Setting Up Local Server


 
