'use strict';

const rp = require('request-promise');

class Actionably {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  logIncoming(data) {
    console.log('Incoming');
    console.log(JSON.stringify(data, null, 2));
    rp({
      uri: `http://localhost:3000/track?apiKey=${this.apiKey}&type=incoming`,
      method: 'POST',
      json: data
    });
  }
  logOutgoing(data) {
    console.log('Outgoing');
    console.log(JSON.stringify(data, null, 2));
    rp({
      uri: `http://localhost:3000/track?apiKey=${this.apiKey}&type=outgoing`,
      method: 'POST',
      json: data
    });
  }
  logOutgoingResponse(error, response) {
    console.log('Outgoing response');
    console.log(JSON.stringify(error, null, 2));
    console.log(JSON.stringify(response.body, null, 2));
    rp({
      uri: `http://localhost:3000/track?apiKey=${this.apiKey}&type=outgoingResponse`,
      method: 'POST',
      json: {
        error: error,
        responseBody: response.body
      }
    });
  }
}

module.exports = (apiKey) => new Actionably(apiKey);
