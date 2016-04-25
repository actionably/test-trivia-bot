'use strict';

class Actionably {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  logIncoming(data) {
    console.log('Incoming');
    console.log(JSON.stringify(data, null, 2));
  }
  logOutgoing(data) {
    console.log('Outgoing');
    console.log(JSON.stringify(data, null, 2));
  }
  logOutgoingResponse(error, response) {
    console.log('Outgoing response');
    console.log(JSON.stringify(error, null, 2));
    console.log(JSON.stringify(response.body, null, 2));
  }
}

module.exports = (apiKey) => new Actionably(apiKey);
