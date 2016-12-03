'use strict';

let app      = require('../app');
let request  = require('supertest');
let tester   = require('./testHarness');

// Global test setup
before(function () {
    this.data = {
        user: {username: 'johndoe', email: 'john@doe.com'},
        book: {name: 'Zen and the Art of Motorcycle Maintenance', isbn: '9780688002305'},
        note: {title: 'Yet another note...', pg: 8, endPg: 12, content: 'This is all the content in this note.'}
    };
    return require('../models').sequelize.sync();
});

beforeEach(function () {
    this.models = require('../models');

    return tester.clearDB(this.models);
});
