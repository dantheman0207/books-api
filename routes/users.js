let express = require('express');
let router = express.Router({mergeParams: true});
let models = require('../models');
let booksController = require('./controllers/booksController');

/* Create a User
*/
router.post('/user', function(req, res) {
	// validate request
	let schema = {
		'email': {
			optional: true,
			isEmail: {
				errorMessage: 'Invalid email'
			}
		},
		'username': {
			optional: true
		}
	};
	req.checkBody(schema);

	// create User
	models.User.create({
		username: req.body.username,
        email: req.body.email
	});
	res.send();
});

/* Get User info
*/
router.get('/user/:user_id', function(req,res) {
    console.log('get user called for id: ' + req.params.user_id + '\nwith user: ' + req.user);
    console.log('req.params:');
    Object.keys(req.params).forEach(function(key, index) {
        "use strict";
        console.log(index + ': ' + key + ': ' + req.params[key]);
    });

    req.user
        .then(function(user) {
            res.send(user);
        });
});

/* Update a User
 */
router.put('/user/:user_id', function(req, res) {
    // validate request
    let schema = {
        'email': {
            optional: true,
            isEmail: {
                errorMessage: 'Invalid email'
            }
        },
        'username': {
            optional: true
        }
    };
    req.checkBody(schema);

    req.user
        .then(function (user) {
            user.update(req.body);
        });

    res.send();
});

/* Delete a User
 */
router.delete('/user/:user_id', function(req, res) {
    req.user_id
        .then(function (userID) {
            // find and destroy child books
            let parameters = {
                where: {
                    UserId: userID
                }
            };
            return models.Book.findAll(parameters)
        })
        .then(function (books) {
            return books.map(book => {
                return booksController.destroyBookAndNotes(book);
            })
        })
        .then(function () {
            // find user
            return req.user;
        })
        .then(function (user) {
            // destroy user
            user.destroy();
        });
    // close connection ( NOT blocked by delete operations )
    res.send();
});

module.exports = router;
