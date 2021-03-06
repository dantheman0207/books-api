let express = require('express');
let router  = express.Router({mergeParams: true}); // to preserve parent router params
let models  = require('../models');
let helper  = require('./controllers/booksController');

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
        },
        'lastPg': {
            optional: true,
            isInt: true
        }
    };

    // validate body against schema
    req.checkBody(schema);

    // create Book
    req.user_id
        .then((UserId) => {
            let book = Object.assign(req.body, {UserId});
            return models.Book.create(book);
        })
        .then((book) => {
            res.end("\"" + book.id + "\"");
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
            optional: true
        },
        'lastPg': {
            optional: true,
            isInt: true
        }
    };

    //req.checkBody(schema);

    req.book
        .then((book) => {
            book = Object.assign(book, req.body);
            return book.save();
        })
        .then((book) => {
            res.end();
        });
});

/* Destroy a Book
 */
router.delete('/user/:user_id/book/:book_id', function (req, res) {
    req.book
        .then((book) => {
            return helper.destroyBookAndNotes(book);
            /* IN THEORY THE BELOW CODE WORKS ... BUT IT NEVER DOES
            let params = {cascade: true};
            return book.destroy();
            */
        })
        .then(() => {
            res.end();
        });
});

module.exports = router;
