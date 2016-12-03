'use strict';

let app      = require('../app');
let request  = require('supertest');

// API test
describe('API', function () {
    it('loads correctly', function (done) {
        request(app).get('/')
            .expect(200)
            .expect(/API/, done);
    });
});
