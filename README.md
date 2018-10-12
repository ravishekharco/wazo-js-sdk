# Wazo's JavaScript Software Development Kit

[![npm version](https://badge.fury.io/js/%40wazo%2Fsdk.svg)](https://badge.fury.io/js/%40wazo%2Fsdk)
[![Greenkeeper badge](https://badges.greenkeeper.io/wazo-pbx/wazo-js-sdk.svg)](https://greenkeeper.io/)

The Wazo JavaScript Software Development Kit is an API wrapper making it easy for you to communicate with your Wazo server. It allows you to add Wazo functionalities to any JavaScript application you are developing.

## Usage

### Install / Add
You may install the Wazo JavaScript Software Development Kit to your project one of the following ways:
* `npm install @wazo/sdk`
* `yarn add @wazo/sdk`

### Content Delivery Networks
Alternatively, you may load the Wazo SDK from a CDN. Use one of the following Content Delivery Networks:

#### UNPKG
```
<script src="https://unpkg.com/@wazo/sdk"></script>
```

#### jsDelivr
```
<script src="https://cdn.jsdelivr.net/npm/@wazo/sdk"></script>
```

### Require / Import
Depending on your preference, you may require or add the Wazo SDK to your own client application one of the following ways:
* `const { WazoApiClient } = require('@wazo/sdk');`
* `import { WazoApiClient } from '@wazo/sdk';`

### Init
```js
const client = new WazoApiClient({
  server: 'demo.wazo.community', // required string
  agent: null // http(s).Agent instance, allows custom proxy, unsecured https, certificate etc.
});
```

### Log In
```js
client.auth.logIn({
  expiration, // optional integer. Session life in number of seconds. If omitted, defaults to 3600 (an hour).
  username, // required string
  password, // required string
  backend, // optional string. If omitted, defaults to wazo_user
}).then(/* undefined if login failed, or : */{
  metadata: {
    username,
    uuid_tenant_uuid,
    xivo_user_uuid,
    groups,
    xivo_uuid,
    tenants: [{ uuid }],
    auth_id
  },
  token, // should be used for other request
  acls,
  utc_expires_at,
  xivo_uuid,
  issued_at,
  utc_issued_at,
  auth_id,
  expires_at,
  xivo_user_uuid
});
// or
const result = await client.auth.login(/* ... */);
```

### Log Out
```js
client.auth.logOut(token).then(/* ... */);
// or
await client.auth.logOut(token);
```

### Check token
```
client.auth.checkToken(token).then(valid);
// or
const valid = await client.auth.checkToken(token);
```

### Other auth methods

```js
client.auth.listTenants(token);
client.auth.createTenant(token, name);
client.auth.deleteTenant(token, uuid);
client.auth.listUsers(token);
client.auth.listGroups(token);
client.auth.listPolicies(token);
```

### Application
```js
client.application.calls(token, applicationUuid); // list calls
client.application.hangupCall(token, applicationUuid, callId); // hangup a call
client.application.answerCall(token, applicationUuid, callId, context, exten, autoanswer);  // answer a call
client.application.listNodes(token, applicationUuid); // list nodes
client.application.listCallsNodes(token, applicationUuid, nodeUuid); // list calls in a node
client.application.removeCallNodes(token, applicationUuid, nodeUuid, callId); // remove call from node (no hangup)
client.application.addCallNodes(token, applicationUuid, nodeUuid, callId); // add call in a node
client.application.playCall(token, applicationUuid, callId, language, uri); // play a sound into a call
```

### Confd
```js
client.confd.listUsers(token);
client.confd.getUser(token, userUuid);
client.confd.getUserLineSip(token, userUuid, lineId);
client.confd.listApplications(token);
```

### Accessd
```js
client.accessd.listSubscriptions(token);
client.accessd.createSubscription(token, { productSku, name, startDate, contractDate, autoRenew, term });
client.accessd.getSubscription(token, uuid);
client.accessd.listAuthorizations(token);
client.accessd.getAuthorization(token, uuid);

```

### WebRTCPhone
```js
import { WazoWebRTCClient } from '@wazo/sdk';

const config = {
  wsServer: 'wss://path.to/asterisk/ws',
  displayName: 'My Display Name',
  authorizationUser: 'line username',
  password: 'line password',
  uri: 'user@server.com',
  media: {
    audio: document.getElementById('audio'), // Pointing to a `<audio id="audio" />` element
    video: document.getElementById('video'), // optional, pointing to a `<video id="video" />` element
    localVideo: document.getElementById('local-video') // optional, pointing to a `<video id="local-video" />` element
  }
};

const phone = new WazoWebRTCClient({
  displayName: 'From WEB',
  host: 'quintana.wazo.community',
  authorizationUser: lineData.username,
  password: lineData.secret,
  media: {
    audio: boolean | document.getElementById('audio'), // Pointing to a `<audio id="audio" />` element
    video: boolean | document.getElementById('video'), // pointing to a `<video id="video" />` element
    localVideo: boolean | document.getElementById('video'), // pointing to a `<video id="video" />` element
  }
});
// eventName can be on the of events : `connected`, `disconnected`, `registered`, `unregistered`, `registrationFailed`, `invite`, `inviteSent`, `transportCreated`, `newTransaction`, `transactionDestroyed`, `notify`, `outOfDialogReferRequested`, `message`.
phone.on('invite', (session: SIP.sessionDescriptionHandler) => {
  this.currentSession = session;
  // ...
});
// or a wildcard : `*`
phone.on('*', (data: mixed, eventName: string) => {
  
});

phone.call('1234');
```

### Calling a number
```js
phone.call(number: string);
```

### Be notified to a phone call
```js
phone.on('invite', (session: SIP.sessionDescriptionHandler) => {
  this.currentSession = session;
});
```

### Answering a call
```js
phone.answer(session: SIP.sessionDescriptionHandler);
```

## Hangup a call
```js
phone.hangup(session: SIP.sessionDescriptionHandler);
```

## Rejecting a call
```js
phone.reject(session: SIP.sessionDescriptionHandler);
```

## Muting a call
```js
phone.mute(session: SIP.sessionDescriptionHandler);
```

## Unuting a call
```js
phone.unmute(session: SIP.sessionDescriptionHandler);
```

## Holding a call
```js
phone.hold(session: SIP.sessionDescriptionHandler);
```

## Unholding a call
```js
phone.unhold(session: SIP.sessionDescriptionHandler);
```

## Transferring a call
```js
phone.transfert(session: SIP.sessionDescriptionHandler, target: string);
```

## Sending a DTMF tone
```js
phone.sendDTMF(session: SIP.sessionDescriptionHandler, tone: string);
```

## Sending a message
```js
phone.sendDTMF(message: string, destination: string);
```

## Closing the RTC connection
```js
phone.close();
```

### Wazo Websocket
```js
import { WazoWebSocketClient } from '@wazo/sdk';

const ws = new WazoWebSocket({
  host, // wazo websocket host
  token, // valid Wazo token
});

// eventName can be on the of events here: http://documentation.wazo.community/en/stable/api_sdk/websocket.html
ws.on('eventName', (data: mixed) => {
});

// You can also use a wildcard to catch all events
ws.on('*', (data: mixed, eventName: string) => {
});

ws.connect();
```

## Closing the socket
```js
ws.close();
```
