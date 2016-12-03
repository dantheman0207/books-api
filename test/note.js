'use strict';

let app      = require('../app');
let request  = require('supertest');

// User test
describe('Book', function () {
    beforeEach(function() {
        return this.models.User.create(this.data.user)
    });

    it('lets you create a book', function (done) {
        let url = '/api/user/' + this.data.user.id + '/book/';
        request(app).post(url)
            .type('json')
            .send({name: this.data.book.name, isbn: this.data.book.isbn})
            .then(() => {
                let params = {
                    where: {
                        name: this.data.book.name
                    }
                };
                return this.models.Book.find(params)
            })
            .then(() => {
                done();
            });
    });

    it('lets you get an existing book', function (done) {
        this.models.Book.create(this.data.book)
            .then((book) => {
                let url  = '/api/user/' + this.data.user.id + '/book/' + this.data.book.id;
                request(app).get(url)
                    .expect(200)
                    .expect('Content-Type', /json/, done)
            })
    });
});
