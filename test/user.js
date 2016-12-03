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

    it('lets you create a user', function (done) {
        let user = {username: 'johndoe', email: 'john@doe.com'};
        request(app)
            .post('/api/user/')
            .type('json')
            .send(user)
            .then(() => {
                let params = {
                    where: {
                        username: user.username
                    }
                };
                return this.models.User.find(params)
            })
            .then(() => {
                done();
            });
    });
});
