/*jslint node: true */
"use strict";

// Declare the variables used
var expect = require('chai').expect,
    io = require('socket.io-client'),
    mongoose = require('mongoose'),
    request = require('request'),
    sinon = require('sinon'),
    server = require('../index');

// Server tasks
describe('server', function () {
    // Beforehand, start the server
    before(function (done) {
        console.log('Starting the server');
        done();
    });

    // Afterwards, stop the server
    after(function (done) {
        console.log('Stopping the server');
        done();
    });

    // Test the index route
    describe('Test the index route', function () {
        it("should return a page with the title RabbitRabbitRabbit", function (done) {
            request.get({ url: 'http://localhost:5000' }, function (error, response, body) {
                expect(body).to.include('RabbitRabbitRabbit');
                expect(response.statusCode).to.equal(200);
                expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
                done();
            });
        });
    });

    // Test the messages route
    describe('Test the messages route', function () {
        it("should return JSON", function (done) {
            request.get({ url: 'http://localhost:5000/messages' }, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(response.headers['content-type']).to.include('application/json');
                done();
            });
        });
    });

    // Test sending a message
    describe('Test sending a message', function () {
        it("should return 'Message received'", function (done) {
            // Connect to server
            var socket = io.connect('http://localhost:5000', {
                'reconnection delay' : 0,
                'reopen delay' : 0,
                'force new connection' : true
            });

            // Handle the message being received
            socket.on('message', function (data) {
                expect(data.message).to.include('Message received');
                done();
            });

            // Send the message
            socket.emit('send', { message: 'Message received' });
        });
    });

    // Test sending a whitespace message
    describe('Test sending a whitespace message', function () {
        it("should return an error", function (done) {
            // Connect to server
            var socket = io.connect('http://localhost:5000', {
                'reconnection delay' : 0,
                'reopen delay' : 0,
                'force new connection' : true
            });

            // Handle the message being received
            socket.on('error', function (data) {
                expect(data.error).to.be.ok;
                done();
            });

            // Send the message
            socket.emit('send', { message: '   ' });
        });
    });
});
