# Assignment App

# About The Project
This project involves adding new category and with relative questions can be added. A series of Api has been written in order to seamless workflow for a user to signup , login. The user can also update its own profle with image well. A series of categories can be added with relative to its question. Bulk questions can be added with unique categories as well.

# Some Critical cases taken care of:
1> if a user want to add questions in a bulk . He /She can do that , but if the file is old or if it is not matching with required csv file , then it will block and it will stop inserting.
2> if and only if the category ids matching then only it will create questions.
3> once get logged in token will be provided to the user. in order to authenticate.

# Built With:
Javascript
Node js
Express js
Mongoose
Mongodb

# Getting Started
This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

# Prerequisites

npm install npm@latest -g

# Installation
1> Clone the Repo
git clone https://github.com/iampratikdas/assignment.git .

2> install packages
npm install

# env 
MONGO_URI=mongodb://practicedb:1234@localhost:27017/practicedb?authSource=practicedb
JWT_SECRET_USER=MY_SUPER_SECRET_USER
MONGODB_BUCKET= uploads
