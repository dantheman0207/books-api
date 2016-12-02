'use strict';

let app      = require('../app');
let request  = require('supertest');

describe('GET user', function () {
    before(function () {
        return require('../models').sequelize.sync();
    });

    beforeEach(function () {
        this.models = require('../models');

        return Promise.all([
            this.models.User.destroy({ truncate: true }),
            this.models.Book.destroy({ truncate: true }),
            this.models.Notes.destroy({ truncate: true })
        ]);
    });

    it('API loads correctly', function (done) {
        request(app).get('/').expect(200, done);
    });

    it('lists a user if there is one', function (done) {
        this.models.User.create({ username: 'johndoe', email: 'john@doe.com' })
            .then(function () {
                request(app).get('/user/1').expect(/johndoe/, done);
            }, function(err) {
                console.log('\n\nERROR creating user: ' + err + '\n\n');
            })
    });
});
