'use strict';

const express = require('express');
const StartUp = require('./util/start-up.js');

class WebserverStartUp extends StartUp {
  constructor() {
    super('WEBSERVER');
  }
  doStartup() {
    const ws = express();
    ws.route('/').get((req, res) => {
      res.send('Hello');
    });
    this.configureWebserver(ws);
    ws.listen(process.env.PORT);
  }

  configureWebserver(ws) {

    // Error handling.
    ws.use((err, req, res, next) =>  {
      // If the error object doesn't exists
      if (!err) {
        return next();
      }

      // Log it
      console.error(err);
      console.error(err.stack);

      res.status(500).jsonp({
        error: err,
        stack: err.stack
      });
    });
  }
}

new WebserverStartUp().start();
