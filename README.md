### Installation Instructions
Please ensure that you have NPM and NodeJS installed. If you do not, please download the latest version here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

After installing npm, please ensure you install the dependencies using the `npm install` command in the root of this folder.

Please ensure that you have mongodb installed. If you do not, please download the latest version here: https://docs.mongodb.com/manual/installation/

Once mongodb is installed, you need to restore the database dump (which is in the ./mongo-database-dump/ folder).This is done using the `mongorestore` command. This should be automatically installed using mongodb. If it isn't, download if from here: https://docs.mongodb.com/database-tools/mongorestore/#installation. 

First start mongod (as specified in the installation instructions).

Restore the database

```
mongorestore -d <DATABASE-NAME> /mongo-database-dump/
```

This database contains user information in a collection.

By default, this will add the database to mongodb running on localhost:27017


### Run Instructions

As mentioned in the mongo installation instructions, please ensure mongo is running.

To start the NPM server from the root of the project:
```
npm start
```

### Tasks
* create API endpoint to retrieve user information in JSON format
* use this information to create a page to display their information
    * this page should contain a filter to group users by at least one property
    * the project currently support EJS but feel free to use any templating engine
* create an API endpoint to retrieve users who only speak French:
    * use an aggregate query to do this
* create an API endpoint to retrieve users who speak the same set of 5 unique languagues

You will have to do the following (and more) to get started with this:
* write a model file for the database
* connect to the database

You have a week from when you get access to this repository to complete the tasks. Please work on a different branch and make a pull request when you finish.
