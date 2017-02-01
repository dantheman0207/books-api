# Books API
RESTful API for taking notes on books

## API
All resources can be accessed at base URL '/api/'
Each resource can be created, read, updated, and deleted.
Each resource is assigned a unique ID when created.
I used [sequelize](sequelizejs.com) ORM to abstract across databases.
The data types used to define each resource are [here](http://docs.sequelizejs.com/en/latest/api/datatypes)


HTTP POST = Create

HTTP GET = Read

HTTP PUT = Update

HTTP DELETE = Delete

### Users
Users can be accessed at '/user/[USER_ID]'

	User = {
		username: STRING,
		email: STRING
	}

### Books
Books can be accessed at '/user/USER_ID/book/[BOOK_ID]'

	Book = {
		name: STRING,
        isbn: CHAR(13),
        lastPg: INTEGER
	}

### Notes
Notes can be accessed at '/user/USER_ID/book/BOOK_ID/note/[NOTE_ID]'

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
For testing/production, the app uses an in-memory sqlite database. For development, it is configured to use a local Postgres database. Before running in development, change these settings in [config.json](config/config.json)