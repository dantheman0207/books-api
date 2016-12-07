let express = require('express');
let router = express.Router({mergeParams: true});
let models = require('../models');

/* Get Book info
 */
router.get('/user/:user_id/book/:book_id', function (req, res) {
    let book = req.book;
    book
        .then((book) => {
            res.send(book);
        });
});

/* Get all Books
 */
router.get('/user/:user_id/book', function (req, res) {
    req.user_id
        .then((userID) => {
            let parameters = {
                where: {
                    UserId: userID
                }
            };
            return models.Book.findAll(parameters)
        })
        .then(function (books) {
            res.send(books);
        });
});

/* Create a Book
 */
router.post('/user/:user_id/book', function (req, res) {
    // validate request
    let schema = {
        'name': {
            notEmpty: true,
            isLength: {
                options: [{min: 2, max: 80}],
                errorMessage: 'Must be between 2 and 80 chars long'
                // Error message for the validator, takes precedent over parameter message
            },
        },
        'isbn': {
            optional: true
        }
    };
    req.checkBody(schema);

    // create Book
    req.user_id
        .then((UserId) => {
            let book = {
                name: req.body.name,
                isbn: req.body.isbn,
                UserId
            };
            return models.Book.create(book);
        })
        .then(() => {
            res.send();
        })
});

/* Update a Book
 */
router.put('/user/:user_id/book/:book_id', function (req, res) {
    // validate request
    let schema = {
        'name': {
            optional: true,
            isLength: {
                options: [{min: 2, max: 80}],
                errorMessage: 'Must be between 2 and 80 chars long'
                // Error message for the validator, takes precedent over parameter message
            },
        },
        'isbn': {
            optional: true,
            isInt: true
        }
    };
    req.checkBody(schema);

    req.book
        .then((book) => {
            book.update(req.body);
        })
        .then(() => {
            res.send();
        });
});

/* Destroy a Book
 */
router.delete('/user/:user_id/book/:book_id', function (req, res) {
    req.book
        .then((book) => {
            "use strict";
            let params = {cascade: true};
            return book.destroy();
        })
        .then(() => {
            res.send();
        });
});

module.exports = router;
