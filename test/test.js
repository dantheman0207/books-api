'use strict';

let app      = require('../app');
let request  = require('supertest');
let tester   = require('./testHarness');
let models   = require('../models');

// Global test setup
before(function () {
    this.data = {
        user: {username: 'johndoe', email: 'john@doe.com', id: 1},
        book: {name: 'Zen and the Art of Motorcycle Maintenance', isbn: '9780688002305', lastPg: 0, id: 1, UserId: 1},
        note: {title: 'Yet another note...', pg: 8, endPg: 12, content: 'This is all the content in this note.', id: 1, BookId: 1}
    };
    return models.sequelize.sync();
});

beforeEach(function () {
    this.models = models;

    return tester.clearDB(this.models);
});
