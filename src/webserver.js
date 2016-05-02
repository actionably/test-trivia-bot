'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const StartUp = require('./util/start-up.js');
const request = require('request');
const actionably = require('./actionably')('6X9AuMDJv9anq0bSgm9fefDLDHvA5Z1vbxtjM8Nf');

class WebserverStartUp extends StartUp {
  constructor() {
    super('WEBSERVER');
  }
  doStartup() {
    const ws = express();
    ws.use(bodyParser.json()); // For parsing application/json
    ws.route('/').get((req, res) => {
      res.send('Hello');
    });
    ws.get('/facebook/receive/', (req, res) => {
      if (req.query['hub.verify_token'] === 'rfz24ITFHDz1YEwQmS9Z') {
        res.send(req.query['hub.challenge']);
        return;
      }
      res.send('Error, wrong validation token');
    });
    ws.post('/facebook/receive/', (req, res) => {
      actionably.logIncoming(req.body);
      const messagingEvents = req.body.entry[0].messaging;
      for (let i = 0; i < messagingEvents.length; i++) {
        const event = req.body.entry[0].messaging[i];
        const sender = event.sender.id;
        if (event.message && event.message.text) {
          const text = event.message.text;
          this.sendTextMessage(sender, text);
        }
      }
      res.sendStatus(200);
    });

    this.configureWebserver(ws);
  }

  sendTextMessage(sender, text) {
    const messageData = {
      text:'You are right when you say: ' + text
    };
    const data = {
      recipient: {id:sender},
      message: messageData
    };
    const requestId = actionably.logOutgoing(data);
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:process.env.FACEBOOK_PAGE_TOKEN}, //jscs:ignore
      method: 'POST',
      json: data
    }, (error, response, body) => {
      actionably.logOutgoingResponse(requestId, error, response);
    });
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
    ws.listen(process.env.PORT);
  }
}

new WebserverStartUp().start();
