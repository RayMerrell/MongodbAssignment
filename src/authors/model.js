const mongoose = require("mongoose");
const authorSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
});

const Author = mongoose.model("author", authorSchema);

module.exports = Author;