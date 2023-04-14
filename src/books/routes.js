const {Router} = require("express");

const bookRouter = Router();
// const Book = require("./model");
// const Author = require("./../authors/model");


const {getAllBooks}=require("./controllers");
const {findByTitle}=require("./controllers");
const {addBook}=require("./controllers");
const {deleteBook}=require("./controllers");
const {deleteAllBooks}= require("./controllers");
const {getBooksByAuthor} = require("./controllers");
const {dynamicUpdate} = require("./controllers");

bookRouter.post ("/books/findbytitle", findByTitle);
bookRouter.post("/books/addbook", addBook);
bookRouter.get("/books/getallbooks", getAllBooks);
bookRouter.delete("/books/deletebook", deleteBook);
bookRouter.delete("/books/deleteallbooks", deleteAllBooks);
bookRouter.get("/books/getbooksbyauthor", getBooksByAuthor);
bookRouter.post("/books/dynamicupdate", dynamicUpdate);

module.exports = bookRouter;