const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    author:{
        type:String,
        required:true
    },
    genre:{
        typr:String,
        required:trusted
    }
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
