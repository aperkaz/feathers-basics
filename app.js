const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const memory = require('feathers-memory');

const app = express(feathers());

// turn on JSON body parsing for REST
app.use(express.json());
// turn on URL encoding body parsing for REST
app.use(express.urlencoded({ extended: true }));
// set REST transport using Express
app.configure(express.rest());
// set up nice error handler
app.use(express.errorHandler());

app.use('messages', memory({
    paginate: {
        default: 10,
        max: 25
    }
}));

const server = app.listen(3030);

app.service('messages').create({
    text: 'Hello from the server'
});

server.on('listening', () => console.log('Feathers REST API on localhost:3030'))