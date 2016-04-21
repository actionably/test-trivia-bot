'use strict';

const express = require('express');
const bodyParser = require('body-parser');
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
    ws.get('/webhook/', (req, res) => {
      if (req.query['hub.verify_token'] === 'rfz24ITFHDz1YEwQmS9Z') {
        res.send(req.query['hub.challenge']);
        return;
      }
      res.send('Error, wrong validation token');
    });
    ws.post('/webhook/', (req, res) => {
      console.log(req.body);
      const messagingEvents = req.body.entry[0].messaging;
      for (let i = 0; i < messagingEvents.length; i++) {
        const event = req.body.entry[0].messaging[i];
        const sender = event.sender.id;
        if (event.message && event.message.text) {
          const text = event.message.text;
          console.log(text);
          // Handle a text message from this sender
        }
      }
      res.sendStatus(200);
    });

    this.configureWebserver(ws);
  }

  configureWebserver(ws) {
    ws.use(bodyParser.json()); // for parsing application/json

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
    ws.listen(process.env.PORT);
  }
}

new WebserverStartUp().start();
