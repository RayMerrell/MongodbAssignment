require("dotenv").config();
require("./db/connection");

//set up basic server
const express = require("express");
const app = express();
const bookRouter = require("./books/routes");
const authorRouter=require("./authors/controller");

app.use(express.json());
app.use(bookRouter);
app.use(authorRouter);


const Book = require("./books/model");
const Author = require("./authors/model");

app.listen(5001, () => console.log("Server is listening"));


