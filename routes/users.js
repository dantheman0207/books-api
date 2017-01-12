let express = require('express');
let router = express.Router({mergeParams: true});
let models = require('../models');

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
	})
    .then(() => {
        res.send();
    });
});

/* Get User info
*/
router.get('/user/:user_id', function(req,res) {
    req.user
        .then((user) => {
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

    if (!req.body) {
        res.status(500).send("Cannot PUT a user without any data attached")
    }

    req.user
        .then((user) => {
            user.update(req.body);
        })
        .then(() => {
            res.send();
        });
});

/* Delete a User
 */
router.delete('/user/:user_id', function(req, res) {
    req.user
        .then((user) => {
            "use strict";
            let params = {cascade: true};
            user.destroy(params);
        })
        .then(() => {
            res.send();
        });
});

module.exports = router;
