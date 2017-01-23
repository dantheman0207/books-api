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
        beforeEach(function() {
            return this.models.Book.create(this.data.book)
                .then((book) => {
                    this.book = book.id;
                })
        });

        it('lets you update book name', function (done) {
            let name = 'a book name';
            request(app).put('/api/user/' + this.user + '/book/' + this.book)
                .type('json')
                .send({name})
                .then(() => {
                    return this.models.Book.findById(this.book)
                })
                .then((book) => {
                    if ( book.name !== name ) {
                        done(new Error('book name not changed'));
                    } else {
                        done();
                    }
                })
        });

        it('lets you update isbn', function (done) {
            let isbn = '1234567891013';
            request(app).put('/api/user/' + this.user + "/book/" + this.book)
                .type('json')
                .send({isbn})
                .then(() => {
                    return this.models.Book.findById(this.book)
                })
                .then((book) => {
                    if ( book.isbn !== isbn ) {
                        done(new Error('isbn not changed'));
                    } else {
                        done();
                    }
                })
        });

        it('lets you update last pg read', function (done) {
            let lastPg = 5;
            request(app).put('/api/user/' + this.user + "/book/" + this.book)
                .type('json')
                .send({lastPg})
                .then(() => {
                    return this.models.Book.findById(this.book)
                })
                .then((book) => {
                    if ( book.lastPg !== lastPg ) {
                        done(new Error('lastPg not changed'));
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

    /*
     */
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
                .then(({BookId, NoteId}) => {
                    let promises = [
                        this.models.Book.findById(BookId),
                        this.models.Notes.findById(NoteId)
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
});
