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
			notEmpty: false
		}
	};
	req.checkBody(schema);

	if ( !(req.body.username || req.body.email) ) {
        res.status(500).send('invalid input');
    }
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
    req.user
        .then(function(user) {
            if (user) {
                res.send(user);
            }
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
            return user.destroy();
        })
        .then(() => {
            res.send();
        });
});

module.exports = router;
