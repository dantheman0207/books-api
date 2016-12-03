'use strict';

let app      = require('../app');
let request  = require('supertest');
let tester   = require('./testHarness');

// User test
describe('Book', function () {
    beforeEach(function() {
        return tester.createUser(this.model, this.data);
    });

    describe('GET', function () {

        it('lets you get an existing book', function (done) {
            this.models.Book.create(this.data.book)
                .then(() => {
                    let url  = '/api/user/1/book/1';
                    request(app).get(url)
                        .expect(200)
                        .expect('Content-Type', /json/, done)
                })
        });
    });

    describe('POST', function () {

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
    });

    describe('PUT', function () {

    });

    describe('DELETE', function () {

        beforeEach(function() {
            return this.models.User.findById(this.data.user.id)
                .then((user) => {
                    return user.id
                })
                .then((UserId) => {
                    let id = {UserId};
                    let book = Object.assign(this.data.book, id);
                    return this.models.Book.create(book);
                });
        });

        it('successfully removes a book', function (done) {
            let url = '/api/user/1/book/1';
            request(app).delete(url)
                .then(() => {
                    return this.models.Book.findById(1);
                })
                .then((book) => {
                    if (book) {
                        done(new Error('failed to delete book'));
                    } else {
                        done();
                    }
                })
        });

        it('successfully removes a book and child notes', function (done) {

            let url = '/api/user/' + this.data.user.id + '/book/' + this.data.book.id;

            tester.createUserAndBookAndNote(this.models, this.data)
                .then(() => {
                    return request(app).delete(url)
                })
                .then(() => {
                    return this.models.Book.findById(this.data.book.id);
                })
                .then((book) => {
                    if (book) {
                        done(new Error('failed to delete book'));
                    }
                })
                .then(() => {
                    return this.models.Notes.findById(this.data.note.id)
                })
                .then((note) => {
                    if (note) {
                        done(new Error('failed to delete note'));
                    } else {
                        done();
                    }
                })
        })
    });
});
