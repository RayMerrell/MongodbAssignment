require("dotenv").config();
require("./db/connection");

//set up basic server
const express = require("express");
const app = express();
app.use(express.json());

const Book = require("./books/model");
const Author = require("./authors/model");

async function getAuthorByID(ID){
    const foundAuthor = await Author.findOne(
        {_id:ID}
    )
    if (foundAuthor){
        return foundAuthor;
    }else{
        return 0;
    }
};

async function getAuthor(fn, ln){
    const existingAuthor = await Author.findOne(
        {firstName:fn,
        lastName:ln}
    )
    if (existingAuthor){
        return existingAuthor;
    }else{
        return 0;
    }
};

app.get("/books/getbooksbyauthor", async(req, res)=>{
    try {
        const existingAuthor = await getAuthor(req.body.firstName,req.body.lastName);
        if (existingAuthor){
            const bookList = await Book.find({
            author:existingAuthor._id
            });
            let returnList=[];
            let index=0;
            bookList.map(nextBook=>{
                returnList[index]={
                    id:nextBook._id,
                    title:nextBook.title,
                    author:existingAuthor.firstName + " " + existingAuthor.lastName,
                    genre:nextBook.genre
                }
                index++;
            })
            const successResponse = {
            message: "success",
            bookList: returnList
            };
            res.status(201).json(successResponse);
        }else{
            const failedResponse = {
                message: "Cannot find author"
                };
                
            res.status(500).json(failedResponse);
        }
      } catch (e) {
        console.log("Fiddlesticks:-", e);
        res.status(501).json("Creation failure");
      }
})

app.post("/books/addauthor", async(req, res)=>{
    try {
        const existingAuthor = await getAuthor(req.body.firstName,req.body.lastName);
        if (!existingAuthor){
            const newAuthor = await Author.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName
            });
            const successResponse = {
            message: "Author added",
            newAuthor: newAuthor,
            };
            res.status(201).json(successResponse);
        }else{
            const failedResponse = {
                message: "Author exists"
                };
                
            res.status(500).json(failedResponse);
        }
      } catch (e) {
        console.log("Fiddlesticks:-", e);
        res.status(501).json("Creation failure");
      }
})

app.get("/books/getallauthors", async (req, res)=>{
    try {
        const allAuthors = await Author.find({});
        const successResponse = {
          message: "success",
          authors: allAuthors,
        };
    
        res.status(200).json(successResponse);
      } catch (e) {
        console.log("Not working...", e);
        res.status(500).json("Listing failure");
      }
});

app.delete("/books/deleteauthor", async (req, res)=>{
    try {
        const newResponse = await Author.findOneAndDelete(
            { firstName: req.body.firstName,
            lastName:req.body.lastName });

        const successResponse = {
          message: "successfully deleted",
          response: newResponse
        };
        res.status(201).json(successResponse);
      } catch (e) {
        console.log("Not working...", e);
        res.status(401).json("Bad request");
      }
})

app.post ("/books/findbytitle", async (req, res)=>{
    try {
        let newAuthor={};

        const newBook = await Book.findOne(
          { title: req.body.title }
        );
        if (newBook){
            newAuthor = await getAuthorByID(newBook.author)
        }
        if (newBook && newAuthor){
            let returnBook = {
                title:newBook.title,
                author:newAuthor.firstName + " " + newAuthor.lastName,
                genre:newBook.genre,
                ID:newBook._id
            }
            const successResponse = {
            message: "success",
            result: returnBook,
            };
            res.status(201).json(successResponse);
        }else{
            let failedResponse ={};
            if(newBook){//we didn't find the author
                failedResponse  = { message:"Cannot find author" };
            }else{
                failedResponse  = { message:"Cannot find book" };
            }
            res.status(500).json(failedResponse);
        }
      } catch (e) {
        console.log("Not working...", e);
        res.status(401).json("Bad request");
      }
})

app.post("/books/addbook", async (req, res) => {
  try {
    const existingAuthor = await getAuthor(req.body.firstName,req.body.lastName);
    console.log("existing author", existingAuthor);
    if (existingAuthor){
        let authorID = existingAuthor._id;
        const newBook = await Book.create({
            title: req.body.title,
            author:authorID,
            genre: req.body.genre,
          });
          const successResponse = {
            message: "success",
            newBook: newBook
          };
          res.status(201).json(successResponse);
    }else{
        const failedResponse = {
            message:"Author not found"  
        }
        res.status(201).json(failedResponse)
    }
  } catch (e) {
    console.log("Fiddlesticks:-", e);
    res.status(501).json("Creation failure");
  }
});

app.get("/books/getallbooks", async (req, res) => {
  try {
    const bookList = await Book.find({});
    const authorList = await Author.find({}); //meh

    let returnList={};
    let index=0;
    bookList.map(nextBook=>{
        let arrAuthor = authorList.filter(author => {
            author._id == nextBook.author;
        });
        let strAuthor = arrAuthor[0].firstName + " " + arrAuthor[0].lastName;
        returnList[index]={
            id:nextBook._id,
            title:nextBook.title,
            author:strAuthor,
            genre:nextBook.genre
        }
        index++;
    })
    const successResponse = {
      message: "success",
      books: returnList,
    };
    res.status(200).json(successResponse);
  } catch (e) {
    console.log("Not working...", e);
    res.status(500).json("Listing failure");
  }
});

app.put("/books/updatebookauthor", async (req, res) => {
  try {
    const foundBook = await Book.findOne(
      { title: req.body.title }
    ).exec();
    let foundAuthor = await Author.findOne(
        {firstName:req.body.firstName, lastName:req.body.lastName}
    ).exec();
    if (!foundAuthor){
        foundAuthor = await Author.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName
        });
    }else{
        newBook = await Book.findOneAndUpdate(
            {title:foundBook.title},
            {author:foundAuthor._id},
            {new:true}
        )
    }
    if (newBook){
        const returnBook={
            ID:newBook._id,
            title:newBook.title,
            author:foundAuthor.firstName + " " + foundAuthor.lastName,
            genre:newBook.genre
        }
        const successResponse = {
        message: "success",
        newBook: returnBook,
        };
        res.status(201).json(successResponse);
    }else{
        const failedResponse = {
            message: "FiddlesSticks"
            };
        res.status(500).json(failedResponse);
    }
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

app.delete("/books/deleteallbooks", async (req, res)=>{
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
    console.log("body", req.body);
    let edit={};    
    let newBook = {};
    let fieldName = Object.keys(req.body)[1];
    if(fieldName == "newTitle"){ 
        edit={title:req.body.newTitle}
    }else{
        edit[fieldName] = req.body[fieldName];
    };
    if (fieldName == "firstName"){ //oh boy
        let foundAuthor = await Author.findOne(
            {firstName:req.body.firstName, lastName:req.body.lastName}
        ).exec();
        console.log("Found author1", foundAuthor);
        if (!foundAuthor){
            foundAuthor = await Author.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName
            });
        }
        console.log("author ID ", foundAuthor._id.toString());
        newBook = await Book.findOneAndUpdate(
            {title:req.body.title},
            {author:foundAuthor._id.toString()},
            {new:true}
        )
    }else{
        let query  = { title: req.body.title };
        let options = { new: true };
        console.log(query, edit, options);
        newBook = await Book.findOneAndUpdate(
            query, edit, options
        ); 
    }
    let successResponse = {};
    console.log("new book", newBook);
    if (newBook) {
        let objAuthor = await getAuthorByID(newBook.author);

        let resultBook ={
            ID:newBook._id,
            title:newBook.title,
            author:objAuthor.firstName + " " + objAuthor.lastName,
            genre:newBook.genre
        };        
      successResponse = { message: "success", newRecord: resultBook };
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
