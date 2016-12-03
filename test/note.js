'use strict';

let app      = require('../app');
let request  = require('supertest');

// User test
describe('Note', function () {
    beforeEach(function() {
        return this.models.User.create(this.data.user)
            .then((user) => {
                let id = {id: user.id};
                let book = Object.assign(this.data.book, id);
                return this.models.Book.create(book);
            });
    });

    describe('GET', function () {

        it('lets you get an existing note', function (done) {
            this.models.Notes.create(this.data.note)
                .then(() => {
                    let url  = '/api/user/' + this.data.user.id
                        + '/book/' + this.data.book.id
                        + '/note/' + this.data.note.id;
                    request(app).get(url)
                        .expect(200)
                        .expect('Content-Type', /json/, done)
                })
        });
    });

    describe('POST', function () {

        it('lets you create a note', function (done) {
            let url = '/api/user/' + this.data.user.id + '/book/' + this.data.book.id;
            let note = {
                title: this.data.note.title,
                pg: this.data.note.pg,
                endPg: this.data.note.endPg,
                content: this.data.note.content
            };
            request(app).post(url)
                .type('json')
                .send(note)
                .then(() => {
                    return this.models.Notes.findById(this.data.note.id)
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
            return this.models.Book.findById(this.data.book.id)
                .then((book) => {
                    let id = {id: book.id};
                    let note = Object.assign(this.data.note, id);
                    return this.models.Notes.create(note);
                });
        });

        it('successfully removes a note', function (done) {
            let url = '/api/user/' + this.data.user.id + '/book/' + this.data.book.id + '/note/' + this.data.note.id;
            request(app).delete(url)
                .then(() => {
                    return this.models.Notes.findById(this.data.note.id);
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
