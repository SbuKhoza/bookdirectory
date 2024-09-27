const http = require('http');
const { parse } = require('url');
const { v4: uuidv4 } = require('uuid'); 
const fs = require('fs');

const PORT = 3000;
const DATA_FILE = './books.json';

// Function to read data from books.json
const readBooksData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
        });
    });
};

// Function to write data to books.json  
const writeBooksData = (books) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2), 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Validation function for book field
const validateBook = (book) => {
    if (!book.title || !book.author || !book.publisher || !book.publishedDate || !book.isbn) {
        return false;
    }
    // Validates: ISBN should be a valid number   
    if (isNaN(book.isbn)) {
        return false;
    }
    return true;
};

// Create the HTTP server
const server = http.createServer(async (req, res) => {
    const urlParts = parse(req.url, true);
    const method = req.method;
    const isbn = urlParts.query.isbn; 

    // Set JSON response header
    res.setHeader('Content-Type', 'application/json');

    try {
        let books = await readBooksData();

        // GET requests (get all books or a specific one by ISBN)
        if (method === 'GET') {
            if (isbn) {
                const book = books.find(b => b.isbn === isbn);
                if (book) {
                    res.writeHead(200);
                    res.end(JSON.stringify(book));
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify({ message: 'Book not found' }));
                }
            } else {
                res.writeHead(200);
                res.end(JSON.stringify(books));
            }
        }

        // Handle POST requests (add a new book)
        else if (method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const newBook = JSON.parse(body);
                if (!validateBook(newBook)) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ message: 'Invalid book data' }));
                } else {
                    books.push(newBook);
                    await writeBooksData(books);
                    res.writeHead(201);
                    res.end(JSON.stringify(newBook));
                }
            });
        }

        // PUT/PATCH requests (update an existing book by ISBN)
        else if (method === 'PUT' || method === 'PATCH') {
            if (!isbn) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'ISBN required to update book' }));
            } else {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', async () => {
                    const updatedBook = JSON.parse(body);
                    if (!validateBook(updatedBook)) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ message: 'Invalid book data' }));
                    } else {
                        const bookIndex = books.findIndex(b => b.isbn === isbn);
                        if (bookIndex === -1) {
                            res.writeHead(404);
                            res.end(JSON.stringify({ message: 'Book not found' }));
                        } else {
                            books[bookIndex] = updatedBook;
                            await writeBooksData(books);
                            res.writeHead(200);
                            res.end(JSON.stringify(updatedBook));
                        }
                    }
                });
            }
        }

        // DELETE requests (delete a book by ISBN)
        else if (method === 'DELETE') {
            if (!isbn) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'ISBN required to delete book' }));
            } else {
                const filteredBooks = books.filter(b => b.isbn !== isbn);
                if (filteredBooks.length === books.length) {
                    res.writeHead(404);
                    res.end(JSON.stringify({ message: 'Book not found' }));
                } else {
                    await writeBooksData(filteredBooks);
                    res.writeHead(200);
                    res.end(JSON.stringify({ message: 'Book deleted successfully' }));
                }
            }
        }

        // Unsupported HTTP methods
        else {
            res.writeHead(405, { 'Allow': 'GET, POST, PUT, PATCH, DELETE' });
            res.end(JSON.stringify({ message: 'Method Not Allowed' }));
        }
    } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
