/**
 * Created by daniel on 12/3/16.
 */

class tester {
    // Returns a Promise which resolves to a user : Sequelize object
    static createUser (model, data) {
        return model.User.create(data.user);
    }

    static createUserAndBook (model, data) {
        return model.User.create(data.user)
            .then((user) => {
                let id = {id: user.id};
                let book = Object.assign(data.book, id);
                return Promise.all([user.id,model.Book.create(book)]);
            })
            .then(([UserId, book]) => {
                return {UserId, BookId: book.id}
            });
    }

    static createUserAndBookAndNote (model, data) {
        return model.User.create(data.user)
            .then((user) => {
                return user.id;
            })
            .then((UserId) => {
                let foreign_key = {UserId};
                let book = Object.assign(data.book, foreign_key);
                return model.Book.create(book);
            })
            .then((book) => {
                return book.id;
            })
            .then((BookId) => {
                let foreign_key = {BookId};
                let note = Object.assign(data.note, foreign_key);
                return Promise.all([BookId, model.Notes.create(note)]);
            })
            .then(([BookId, note]) => {
                return {BookId, NoteId : note.id}
            });
    }

    static createUsers (amt, model, data) {
        return this.duplicateData(amt, data)
            .then((dataset) => {
                var promises = [];
                for (var data in dataset) {
                    promises.push(this.createUser(model, data));
                }
                return Promise.all(promises);
            })

    }
    // honestly don't even know if this works
    static createBooks (amt, model, data) {
        return function (user) {
            user
                .then((user) => {
                    this.duplicateData(amt, data)
                        .then((dataset) => {
                            return Promise.all(dataset.map((data) => {
                                data.book.UserId = user.id
                                return model.createBook(model, data);
                            }));
                        })
                })
        }.bind(this)
    }

    static clearDB (model) {
        let params = {restartIdentity: true, cascade: true};
        let promises = [
            model.Notes.truncate(params),
            model.Book.truncate(params),
            model.User.truncate(params)
        ];
        return Promise.all(promises);
    }

    static duplicateData (amt, data) {
        var promises = [];
        for (var i = 0; i < amt; i++) {
            var promise = this.increaseIDsBy(i, data);
            promises.push(promise);
        }
        return Promise.all(promises);
    }

    static increaseIDsBy (amt, givenData) {
        var data = JSON.parse(JSON.stringify(givenData)); // deep copy object
        let newID = givenData.user.id + amt;
        data.user.id = newID;
        data.book.id = newID;
        data.note.id = newID;
        data.book.UserId = newID;
        data.note.BookId = newID;

        return new Promise((resolve, reject) => {
            resolve(data);
        })
    }
}

module.exports = tester;
