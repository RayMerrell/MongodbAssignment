require("dotenv").config();
require("./db/connection");


//set up basic server
const express = require ("express");
const app = express();
app.use(express.json());

// Book:
//     id: string
//   *  title: string   
//   *  author: string
//   *  genre: string
//     __v:number

// Response
//     SuccessResponse:
//         type: object  
//         status: 201  
//         properties:
//             message:
//                 type: string
//                 example: 'success'
//             newBook:
//                 type: object
//                 properties:
//                     title: string
//                     author: string  
//                     genre: string
//                     _id: string

const Book = require("./books/model");

app.post("/books/addbook", async (req, res)=>{  //path comes from create.txt (aka business logic)
    try {
        const newBook = await Book.create({
            title:req.body.title,
            author:req.body.author,
            genre:req.body.genre
        });        
        const successResponse={
            message:"success",
            newBook:newBook
        }    
        res.status(201).json(successResponse); 
    } catch (e) {
        console.log("Fiddlesticks:-", e)
        res.status(501).json("Creation failure");
    }

});

app.get("/books/getallbooks", async (req, res)=>{
    try {
        const allBooks = await Book.find({});
        const successResponse ={
            message:"success",
            books:allBooks
        };

        res.status(200).json(successResponse);
        
    } catch (e) {
        console.log("Not working...", e);
    }
})
app.listen(5001, ()=>console.log("Server is listening"));
