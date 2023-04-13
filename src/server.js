require("dotenv").config();
require("./db/connection");

//set up basic server
const express = require("express");
const app = express();
app.use(express.json());

const Book = require("./books/model");

app.post ("/books/findbytitle", async (req, res)=>{
    try {
        const newBook = await Book.findOne(
          { title: req.body.title }
        );
        const successResponse = {
          message: "success",
          author: newBook,
        };
    
        res.status(201).json(successResponse);
      } catch (e) {
        console.log("Not working...", e);
        res.status(401).json("Bad request");
      }
})

app.post("/books/addbook", async (req, res) => {
  //path comes from create.txt (aka business logic)
  try {
    const newBook = await Book.create({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
    });
    const successResponse = {
      message: "success",
      newBook: newBook,
    };
    res.status(201).json(successResponse);
  } catch (e) {
    console.log("Fiddlesticks:-", e);
    res.status(501).json("Creation failure");
  }
});

app.get("/books/getallbooks", async (req, res) => {
  try {
    const allBooks = await Book.find({});
    const successResponse = {
      message: "success",
      books: allBooks,
    };

    res.status(200).json(successResponse);
  } catch (e) {
    console.log("Not working...", e);
    res.status(500).json("Listing failure");
  }
});

app.put("/books/updatebookauthor", async (req, res) => {
  try {
    const newBook = await Book.findOneAndUpdate(
      { title: req.body.title },
      { author: req.body.newAuthor },
      { new: true }
    );
    const successResponse = {
      message: "success",
      author: newBook,
    };

    res.status(201).json(successResponse);
  } catch (e) {
    console.log("Not working...", e);
    res.status(401).json("Bad request");
  }
});

app.delete("/books/deletebook", async (req, res) => {
  try {
    const newBook = await Book.findOneAndDelete({ title: req.body.title });
    const successResponse = {
      message: "successfully deleted",
      looky: newBook,
    };
    res.status(201).json(successResponse);
  } catch (e) {
    console.log("Not working...", e);
    res.status(401).json("Bad request");
  }
});

app.delete("/books/deleteall", async (req, res)=>{
    const result = await Book.deleteMany({});
    const successResponse = {
      message: "success",
      result: result
    };
    res.status(201).json(successResponse);
})

app.post("/books/dynamicupdate", async (req, res) => {
  console.log("Dynamic update");
  try {
    const fieldName = Object.keys(req.body)[1];

    console.log("fieldName", fieldName, "data", req.body[fieldName]);
    console.log(req.params);
    let newBook = {};
    // newBook = await Book.findOneAndUpdate(
    //     { title: req.body.title },
    //     { fieldName: req.body[fieldName] },
    //     { new: true }
    // );  
    switch (fieldName) {
      case "author":
        console.log("edit author");
        newBook = await Book.findOneAndUpdate(
          { title: req.body.title },
          { author: req.body.author },
          { new: true }
        );
        break;
      case "genre":
        console.log("edit genre");
        newBook = await Book.findOneAndUpdate(
          { title: req.body.title },
          { genre: req.body.genre },
          { new: true }
        );
        break;
    }
    let successResponse = {};
    if (newBook !== undefined) {
      successResponse = { message: "success", newRecord: newBook };
    } else {
      successResponse = { message: "Database error" };
    }
    res.status(201).json(successResponse);
  } catch (e) {
    console.log("Not working...", e);
    res.status(401).json("Bad request");
  }
});

app.listen(5001, () => console.log("Server is listening"));
