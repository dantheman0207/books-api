let seed = function (models) {
    // Clear DB
    models.sequelize.query('TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE;');

    // Initial values
    let firstNote = {
        title: 'So it begins...',
        pg: 0, endPg: 1, content: 'This is the first note, about the first book....'
    };
    let firstBook = {
        name: 'Zen and the Art of Motorcycle Maintenance: An Inquiry Into Values',
        isbn: '0688002307',
        lastPg: 0
    };
    let firstUser = {
        username: 'daniel',
        email: 'ransomdaniell@gmail.com'
    };

    // Propagate to DB
	models.User.create(firstUser)
    .then(user => {
        let book = Object.assign(firstBook, {UserId: user.get('id')});
        return models.Book.create(book);
    })
    .then(book => {
        let note = Object.assign(firstNote, {BookId: book.get('id')});
        return models.Notes.create(note);
    });
};

module.exports = seed;