const {Router} = require("express");
const authorRouter = Router();

const {addAuthor}=require("./controllers");
const {getAllAuthors}=require("./controllers");
const {deleteAuthor}=require("./controllers");
const {updateBookAuthor}=require("./controllers");

authorRouter.post("/books/addauthor", addAuthor);
authorRouter.get("/books/getallauthors", getAllAuthors);
authorRouter.delete("/books/deleteauthor", deleteAuthor);
authorRouter.put("/books/updatebookauthor", updateBookAuthor);

module.exports = authorRouter;