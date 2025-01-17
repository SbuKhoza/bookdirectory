HTTP Book Management API

This is an HTTP-based Book Management API that allows you to perform CRUD operations on a collection of books stored in a JSON file. The application is built using Node.js.

Author

Name: Sibusiso

Email: sibusisok59@gmail.com

How to Run the API

Prerequisites

Ensure Node.js is installed on your machine.

Steps to Run

Download or Clone the Repository:

git clone https://github.com/SbuKhoza/bookdirectory
cd bookdirectory

Initialize the Data File:
Make sure there is a books.json file in the root directory or in the same directory as the script. Create an empty books.json file if it does not already exist:

[]

Run the Server:
Execute the following command:

node <file_name>.js

Replace <file_name> with the name of the file containing the code (e.g., book_api.js).

Access the Application:
Use a tool like Postman, curl, or your browser to interact with the API at http://localhost:3000.

API Endpoints

1. Get All Books

Endpoint: GET /

Description: Retrieves the list of all books.

Response: Array of book objects.

2. Get a Book by ISBN

Endpoint: GET /?isbn=<isbn>

Description: Retrieves a specific book by its ISBN.

Query Parameter: isbn (string)

Response: A single book object or an error message if not found.

3. Add a New Book

Endpoint: POST /

Description: Adds a new book to the collection.

Request Body Example:

{
  "title": "Book Title",
  "author": "Author Name",
  "publisher": "Publisher Name",
  "publishedDate": "YYYY-MM-DD",
  "isbn": "1234567890"
}

Response: The newly added book object.

4. Update an Existing Book

Endpoint: PUT /?isbn=<isbn>

Description: Updates the details of a book identified by its ISBN.

Query Parameter: isbn (string)

Request Body Example:

{
  "title": "Updated Title",
  "author": "Updated Author",
  "publisher": "Updated Publisher",
  "publishedDate": "YYYY-MM-DD",
  "isbn": "1234567890"
}

Response: The updated book object or an error message if not found.

5. Delete a Book

Endpoint: DELETE /?isbn=<isbn>

Description: Removes a book from the collection by its ISBN.

Query Parameter: isbn (string)

Response: Success message or an error message if not found.

Features

Data Storage: Books are stored persistently in a JSON file.

Validation: Ensures all required fields are provided and ISBN is a valid number.

Error Handling: Provides appropriate error messages for invalid input or operations.

Example Interaction

Request

GET /?isbn=1234567890 HTTP/1.1
Host: localhost:3000

Response

{
  "title": "Book Title",
  "author": "Author Name",
  "publisher": "Publisher Name",
  "publishedDate": "2022-01-01",
  "isbn": "1234567890"
}

Contact

For questions or feedback, feel free to reach out to Sibusiso at sibusisok59@gmail.com.

Enjoy managing your book collection with this simple HTTP API!