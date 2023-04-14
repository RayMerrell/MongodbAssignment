const Book = require("./model");
const Author = require("./../authors/model");

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

const deleteAuthor = async (req, res)=>{
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
}
const addAuthor = async(req, res)=>{
    try {
        const existingAuthor = await getAuthor(req.body.firstName,req.body.lastName);
        if (!existingAuthor){
            const newAuthor = await Author.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName
            });
            res.status(201).json({message: "Author added",newAuthor: newAuthor});
        }else{                
            res.status(500).json({message: "Author exists"});
        }
      } catch (e) {
        console.log("Fiddlesticks:-", e);
        res.status(501).json("Creation failure");
      }
};
const getAllAuthors = async(req, res)=>{
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
    const updateBookAuthor = async(req, res)=>{
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
    }
    module.exports = {
        addAuthor,
        getAllAuthors,
        deleteAuthor, 
        updateBookAuthor
    }
}