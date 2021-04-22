module.exports = (error,request,response,next) => {
    console.log(error);
    console.log(error.name);
    if(error.name === "CastError") {
        response.status(400).send({error: "Not a good id"})
    } else {
        response.status(500).end()
    }
}