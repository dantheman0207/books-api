# Books API
RESTful API for taking notes on books

## API
Each resource can be created, read, updated, and deleted with the right HTTP VERB.
Each resource is assigned a unique ID when created.
I used [sequelize](sequelizejs.com) ORM to abstract the data model across databases.
The data types used in the resource definitions are [here](http://docs.sequelizejs.com/en/latest/api/datatypes)


### Users
Users can be accessed at `/api/user/[USER_ID]`

	User = {
		username: STRING,
		email: STRING
	}

### Books
Books can be accessed at `/api/user/USER_ID/book/[BOOK_ID]`

	Book = {
		name: STRING,
        isbn: CHAR(13),
        lastPg: INTEGER
	}

### Notes
Notes can be accessed at `/api/user/USER_ID/book/BOOK_ID/note/[NOTE_ID]`

	Note = {
		title: STRING,
        pg: STRING,
        endPg: STRING,
        content: TEXT  // (long-form string)
	}

## Install

	git checkout https://github.com/dantheman0207/books-api.git

	cd books-api

	npm install

### Test

	npm test

### Run

	npm start


### Development
For testing, the app uses an in-memory sqlite database. For development, it uses a local Postgres database. Before running in development, change the settings in [config.json](config/config.json)