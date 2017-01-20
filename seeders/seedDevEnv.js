let tester = require('../test/testHarness');

// Initial values
let data = {
    firstNote: {
        title: 'So it begins...',
        pg: "0", endPg: "1", content: 'This is the first note, about the first book....'
    },
    firstBook: {
        name: 'Zen and the Art of Motorcycle Maintenance: An Inquiry Into Values',
        isbn: '0688002307',
        lastPg: "0"
    },
    firstUser: {
        username: 'daniel',
        email: 'ransomdaniell@gmail.com'
    }
};

let seed = function (models) {
    // Clear DB
    tester.clearDB(models)
        .then(() => {
            // Propagate to DB
            return tester.createUserAndBookAndNote(models,
                {
                    user: data.firstUser,
                    book: data.firstBook,
                    note: data.firstNote
                }
            );
        })
};

module.exports = seed;