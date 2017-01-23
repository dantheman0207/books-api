'use strict';

let app      = require('../app');
let request  = require('supertest');

// User test
describe('User', function () {

    describe('GET', function () {

        it('lets you get an existing user', function (done) {
            this.models.User.create(this.data.user)
                .then(() => {
                    request(app).get('/api/user/' + this.data.user.id)
                        .expect(200)
                        .expect('Content-Type', /json/, done)
                })
        });

        it('doesn\'t let you get a non-existent user', function (done) {
            request(app).get('/api/user/' + Math.pow(7,7))
                .expect(500, done)
        })
    });

    describe('POST', function () {

        it('lets you create a user', function (done) {
            request(app)
                .post('/api/user/')
                .type('json')
                .send({username: this.data.user.username, email: this.data.user.email})
                .then(() => {
                    let params = {
                        where: {
                            username: this.data.user.username
                        }
                    };
                    return this.models.User.find(params)
                })
                .then(() => {
                    done();
                });
        });

        it('fails on invalid input', function (done) {
            request(app)
                .post('/api/user/')
                .type('json')
                .send({asdf: 'asdf'})
                .end(function(err, res) {
                    if(err || res.status != 500) {
                        done(new Error('no failure on invalid input for user'));
                    } else {
                        done();
                    }
                })
        })
    });

    describe('PUT', function () {
        beforeEach(function() {
            return this.models.User.create(this.data.user);
        });

        it('lets you update username', function (done) {
            let username = 'nEwUsErNaMe';
            request(app).put('/api/user/' + this.data.user.id)
                .type('json')
                .send({username})
                .then(() => {
                    return this.models.User.findById(this.data.user.id)
                })
                .then((user) => {
                    if ( user.username !== username ) {
                        done(new Error('username not changed'));
                    } else {
                        done();
                    }
                })
        });

        it('lets you update email', function (done) {
            let email = 'new@email.com';
            request(app).put('/api/user/' + this.data.user.id)
                .type('json')
                .send({email})
                .then(() => {
                    return this.models.User.findById(this.data.user.id)
                })
                .then((user) => {
                    if ( user.email !== email ) {
                        done(new Error('email not changed'));
                    } else {
                        done();
                    }
                })
        });

        it('rejects invalid username', function (done) {
            let username = 4;
            request(app).put('/api/user/' + this.data.user.id)
                .type('json')
                .send({username})
                .end(function (err, res) {
                    if (err || res.status >= 400) {
                        done(new Error('accepted invalid username'));
                    } else {
                        done();
                    }
                });
        });

        it('rejects invalid email', function (done) {
            let email = 4;
            request(app).put('/api/user/' + this.data.user.id)
                .type('json')
                .send({email})
                .end(function (err, res) {
                    if (err || res.status >= 400) {
                        done(new Error('accepted invalid email'));
                    } else {
                        done();
                    }
                });
        });
    });

    describe('DELETE', function () {
        beforeEach(function() {
            return this.models.User.create(this.data.user);
        });

        it('successfully removes a user', function (done) {
            request(app).delete('/api/user/' + this.data.user.id)
                .then(() => {
                    return this.models.User.findById(this.data.user.id);
                })
                .then((user) => {
                    if (user) {
                        done(new Error('failed to delete user'));
                    } else {
                        done();
                    }
                })
        })
    });
});
