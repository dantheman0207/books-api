let express = require('express');
let router = express.Router({mergeParams: true});
let models = require('../models');


// We match all routes in API in order to trigger calls to this router object
let middleware = function(req, res, next) {
    next();
};

router.all('/api/user/:user_id/', middleware);
router.all('/api/user/:user_id/book/', middleware);
router.all('/api/user/:user_id/book/:book_id/', middleware);
router.all('/api/user/:user_id/book/:book_id/note', middleware);
router.all('/api/user/:user_id/book/:book_id/note/:note_id/', middleware);

/* Returns a promise which calls next() when it resolves.
 * Sets req.user as the user
 * Sets req.user_id as the user id (as a Sequelize DB object)
 */
router.param('user_id', function(req, res, next, id) {
    // @TODO: Validate id { i \in int ; 1 <= i <= MAXINT }
    req.user = models.User.findById(id);
    req.user_id = req.user
        .then(errorHandler(res, id, 'user'))
        .then(function(user) {
            return user.id;
        });
    next();
});

/* Returns a promise which calls next() when it resolves.
 * Sets req.book as the book
 * Sets req.book_id as the book id (as a Sequelize DB object)
 */
router.param('book_id', function(req, res, next, id) {
    // @TODO: Validate id { i \in int ; 1 <= i <= MAXINT }
    req.book = models.Book.findById(id);
    req.book_id = req.book
        .then(errorHandler(res, id, 'book'))
        .then(function(book) {
            return book.id;
        });
    next();
});

/* Returns a promise which calls next() when it resolves.
 * Sets req.note as the note
 * Sets req.note_id as the note id (as a Sequelize DB object)
 */
router.param('note_id', function(req, res, next, id) {
    // @TODO: Validate id { i \in int ; 1 <= i <= MAXINT }
    req.note = models.Notes.findById(id);
    req.note_id = req.note
        .then(errorHandler(res, id, 'note'))
        .then(function(note) {
            return note.id;
        });
    next();
});

router.use('/api', require('./users'));
router.use('/api/', require('./books'));
router.use('/api', require('./notes'));

router.get('/', function(req, res) {
    "use strict";
    res.status(200).send('Books API V1');
});

function errorHandler(res, id, type) {
    "use strict";
    return (object) => {
        return new Promise((resolve, reject) => {
            if (object) {
                resolve(object);
            } else {
                res.status(500).send('No ' + type + ' with ID ' + id + ' found.');
                reject('NULL object means no ' + type + ' with ID ' + id + ' found.');
            }
        });
    }
}

module.exports = router;
