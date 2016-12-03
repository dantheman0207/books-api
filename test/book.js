'use strict';

let app      = require('../app');
let request  = require('supertest');

// User test
describe('User', function () {
    before(function() {
        this.user = {username: 'johndoe', email: 'john@doe.com', id: 1};
    });

    it('lets you create a user', function (done) {
        request(app)
            .post('/api/user/')
            .type('json')
            .send({username: this.user.username, email: this.user.email})
            .then(() => {
                let params = {
                    where: {
                        username: this.user.username
                    }
                };
                return this.models.User.find(params)
            })
            .then(() => {
                done();
            });
    });

    it('lets you get an existing user', function (done) {
        this.models.User.create(this.user)
            .then(() => {
                request(app).get('/api/user/' + this.user.id)
                    .expect(200)
                    .expect('Content-Type', /json/, done)
            })
    });
});
