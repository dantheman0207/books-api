'use strict';

let app      = require('../app');
let request  = require('supertest');
let tester   = require('./testHarness');

// User test
describe('Book', function () {
    beforeEach(function() {
        this.user = tester.createUser(this.models, this.data);
        return this.user;
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
            let url = '/api/user/1/book';
            request(app).post(url)
                .type('json')
                .send({name: this.data.book.name, isbn: this.data.book.isbn})
                .then(() => {
                    let params = {
                        where: {
                            name: this.data.book.name
                        }
                    };
                    return this.models.Book.find(params);
                })
                .then((book) => {
                    if (book) {
                        done();
                    } else {
                        done(new Error('just-created book not found in db'));
                    }
                });
        });
    });

    describe('PUT', function () {

    });

    /* Not currently working but tests in dev env seem to indicate the issue
     *  is no longer that the book/note(s) are not deleted, but that the promise
     *  returns too soon. Rewrite tests to retry db several times...?
     *
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
            // extend time to failure
            this.timeout(5000);

            let url = '/api/user/' + this.data.user.id + '/book/' + this.data.book.id;
            let data = JSON.parse(JSON.stringify(this.data)); // make a deep copy
            delete data.user.id;
            delete data.book.id;
            delete data.book.UserId;
            delete data.note.id;
            delete data.note.BookId;
            tester.createUserAndBookAndNote(this.models, data)
                .then(() => {
                    return request(app).delete(url)
                })
                .then(() => {
                    let promises = [
                        this.models.Book.findById(this.data.book.id),
                        this.models.Notes.findById(this.data.note.id)
                    ];
                    return Promise.all(promises);
                })
                .then(([book, note]) => {
                    console.log('results: ');
                    console.log(book);
                    console.log(note);
                    if (book) {
                        done(new Error('failed to delete book'));
                    } else if (note) {
                        done(new Error('failed to delete note'));
                    } else {
                        done();
                    }
                });
        })
    });
    @TODO: REMOVE ME  */
});
