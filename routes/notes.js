'use strict';
let express = require('express');
let router = express.Router({mergeParams: true});
let models = require('../models');

/* Get Note info
 */
router.get('/user/:user_id/book/:book_id/note/:note_id', function(req,res) {
    let note = req.note;
    note
        .then(function(note) {
            res.send(note);
        });
});

/* Get all Notes
 */
router.get('/user/:user_id/book/:book_id/note', function(req,res) {
    req.book_id
        .then(function(bookID) {
            "use strict";
            let parameters = {
                where: {
                    BookId: bookID
                }
            };
            return models.Notes.findAll(parameters);
        })
        .then(function(notes) {
            res.send(notes);
        });
});

/* Create a Note
*/
router.post('/user/:user_id/book/:book_id/note', function(req, res) {
	// validate request
	let schema = {
		'title': {
			notEmpty: true,
			isLength: {
              options: [{ min: 2, max: 80 }],
              errorMessage: 'Must be between 2 and 80 chars long' // Error message for the validator, takes precedent over parameter message
            },
		},
		'pg': {
			isInt: true
		},
		'endPg': {
			optional: true,
            isInt: true
		},
		'content': {
			notEmpty: true,
			isLength: {
				options: [{min: 2}],
				errorMessage: 'Must contain some content'
			}
		},
        'BookId': {
		    optional: true,
            isInt: true
        }
	};
	req.checkBody(schema);

    req.book_id
        .then(function (bookID) {
            // create Note
            let note = {
                title:  req.body.title,
                pg:     req.body.pg,
                content:req.body.content,
                endPg:  req.body.endPg,
                BookId: bookID
            };
            return models.Notes.create(note);
        });

    res.send();
});

/* Update a Note
 */
router.put('/user/:user_id/book/:book_id/note/:note_id', function(req, res) {
    // validate request
    let schema = {
        'title': {
            optional: true,
            isLength: {
                options: [{ min: 2, max: 80 }],
                errorMessage: 'Must be between 2 and 80 chars long' // Error message for the validator, takes precedent over parameter message
            },
        },
        'pg': {
            optional: true,
            isInt: true
        },
        'endPg': {
            optional: true,
            isInt: true
        },
        'content': {
            optional: true,
            isLength: {
                options: [{min: 2}],
                errorMessage: 'Must contain some content'
            }
        },
        'BookId': {
            optional: true,
            isInt: true
        }
    };
    req.checkBody(schema);

    // update model
    req.note
        .then(function (note) {
            note.update(req.body);
        });

    res.send();
});

/* Destroy a Note
 */
router.delete('/user/:user_id/book/:book_id/note/:note_id', function(req, res) {
    // @TODO: don't forget to destroy child resources

    req.note
        .then(function (note) {
            note.destroy();
        });
    res.send();
});

module.exports = router;
