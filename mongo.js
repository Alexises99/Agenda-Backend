const mongoose = require("mongoose")

const connectString = process.env.MONGO_DB_URI

mongoose.connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
    .then(() => {
        console.log("Database conected");
    }).catch(err => {
        console.log(err);
    })








