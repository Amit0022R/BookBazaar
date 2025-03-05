const fs = require("fs");
const express = require("express");
const { title } = require("process");
const { log } = require("console");
const app = express();
const PORT = 3001;
app.use(express.json());
const FILE_PATH = "book.json";

const readBooksFromFile = () => {
    try {
        const data = fs.readFileSync(FILE_PATH , "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

const writeBooksToFile = (books) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(books, null, 2) , "utf-8" );
;}



// ********** Create a New Book (POST /books) ************\\
app.post("/books" , ( req , res ) => {
    const { title , author , price } = req.body;
    if( !title || !author || typeof price !== "number" || price <= 0 ) {
        return res.status(400).json({error: "Title, Author and Price are required"});
    }

    let books = readBooksFromFile();

    const newBook = {
        id: books.length + 1,
        title,
        author,
        price
    }

    books.push(newBook);

    writeBooksToFile(books);

    res.status(201).json(newBook);
});
// ********************************************************\\



// ************ Read All Books (GET /books)  ***********\\
app.get("/books" , ( req , res ) => {    
    const books = readBooksFromFile();
    res.status(200).json(books);
});
// ********************************************************\\



// *****Read a Specific Book (GET /books/:id)**************\\
app.get("/books/:id" , ( req , res ) => {
    const books = readBooksFromFile();
    const book = books.find( book => book.id === parseInt(req.params.id));
    if(!book) {
        return res.status(404).json({error: "Book not found"});
    }
    res.status(200).json(book);
})
// ********************************************************\\


// *******Update Book Information (PUT /books/:id) *******\\
app.put("/books/:id" , ( req , res ) => {
    const { title , author , price } = req.body;
    let books = readBooksFromFile();

    const bookIndex = books.findIndex( book => book.id === parseInt(req.params.id));

    if(bookIndex === -1) {
        return res.status(404).json({error: "Book not found"});
    }

    if(!title && !author && !price) {
        return res.status(400).json({error: "Title, Author and Price are required"});
    }

    books[bookIndex] = {id: books[bookIndex].id, title , author , price }

    writeBooksToFile(books);

    res.status(200).json(books[bookIndex]);
})
// ********************************************************\\


// *******Delete a Book (DELETE /books/:id)*****************\\
app.delete("/books/:id" , ( req , res) => {

    let books = readBooksFromFile();
    
    const bookIndex = books.findIndex( book => book.id === parseInt(req.params.id));

    if(bookIndex === -1) {
        return res.status(404).json({error: "Book not found"});
    }

    books.splice(bookIndex, 1);
    writeBooksToFile(books);

    res.status(204).send();

} )
// ********************************************************\\

app.listen( PORT , () => {
    log(`Server is running on http://localhost:${PORT}`);
}  )


