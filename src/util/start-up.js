'use strict';

const dbConnection = require('../db/connection');
const color = require('colors');
const express = require('express');
const path = require('path');

class StartUp {
  constructor(name) {
    this.name = name;
  }

  start() {
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'development';
    }
    console.log(`STARTING ${this.name}: NODE_ENV = ${process.env.NODE_ENV}`.green.inverse);
    const dbUrl = process.env.MONGODB_URI || `mongodb://localhost/test-trivia-bot-${process.env.NODE_ENV}`;

    return dbConnection.connectAndLoadModels(dbUrl)
      .then(this.doStartup.bind(this))
      .done(() => {
        console.log(`STARTED ${this.name} SUCCESSFULLY`.green.inverse);
      }, (err) => {
        console.log(`ERROR STARTING ${this.name}: ${err}: ${err.stack}`.red);
      });
  }
}

module.exports = StartUp;
