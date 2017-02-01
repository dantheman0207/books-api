# books API
RESTful API for taking notes on books

## API
All resources can be accessed at base URL '/api/'
Each resource can be created, read, updated, and deleted.
HTTP POST = Create
HTTP GET = Read
HTTP PUT = Update
HTTP DELETE = Delete
### Users
Users can be accessed at (/api/) '/user/[USER_ID]'

### Books
Books can be accessed at (/api/) '/user/USER_ID/book/[BOOK_ID]'

### Notes
Notes can be accessed at (/api/) '/user/USER_ID/book/BOOK_ID/note/[NOTE_ID]'

## Install

	git checkout

	cd books-api

	npm i

## Test

	npm test