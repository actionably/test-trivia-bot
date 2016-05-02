'use strict';

const rp = require('request-promise');
const uuid = require('node-uuid');

class Actionably {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  logIncoming(data) {
    console.log('Incoming');
    console.log(JSON.stringify(data, null, 2));
    rp({
      uri: `http://localhost:3000/track?apiKey=${this.apiKey}&type=incoming&platform=facebook`,
      method: 'POST',
      json: data
    });
  }
  logOutgoing(data) {
    console.log('Outgoing');
    console.log(JSON.stringify(data, null, 2));
    const requestId = uuid.v4();
    rp({
      uri: `http://localhost:3000/track?apiKey=${this.apiKey}&type=outgoing&platform=facebook`,
      method: 'POST',
      json: {
        requestBody: data,
        requestId: requestId
      }
    });
    return requestId;
  }
  logOutgoingResponse(requestId, error, response) {
    console.log('Outgoing response');
    console.log(JSON.stringify(error, null, 2));
    console.log(JSON.stringify(response.body, null, 2));
    rp({
      uri: `http://localhost:3000/track?apiKey=${this.apiKey}&type=outgoingResponse&platform=facebook`,
      method: 'POST',
      json: {
        error: error,
        responseBody: response.body,
        requestId: requestId
      }
    });
  }
}

module.exports = (apiKey) => new Actionably(apiKey);
