/**
 * Created by daniel on 12/3/16.
 */
let tester = require('../testHarness');

let data = {
    user: {username: 'johndoe', email: 'john@doe.com', id: 1},
    book: {name: 'Zen and the Art of Motorcycle Maintenance', isbn: '9780688002305', id: 1, UserId: 1},
    note: {title: 'Yet another note...', pg: 8, endPg: 12, content: 'This is all the content in this note.', id: 1, BookId: 1}
};
/*
 * sanity check
 * dumps to console and lets you review it
 */
tester.duplicateData(4, data)
    .then((dataset) => {
        console.log('\nRESULTS:\n');
        console.log(dataset);
    });

var model = require('../models')
    model.sequelize.sync();

