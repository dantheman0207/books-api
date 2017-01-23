let models = require('../../models');

class booksController {

    // returns a promise
    static destroyBookAndNotes(book) {
        "use strict";
        let parameters = {
            where: {
                BookId: book.id
            }
        };
        return models.Notes.findAll(parameters)
            .then(function (notes) {
                // destroy all child notes
                return notes.map(note => {
                    note.destroy();
                });
            })
            .then(function () {
                // find book
                return book;
            })
            .then(function (book) {
                // destroy book
                return book.destroy();
            });
    }
}

module.exports = booksController;
