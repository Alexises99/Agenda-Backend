
require('dotenv').config()
require('./mongo');

const express = require('express')
const cors = require("cors")
const app = express()
const Contact = require("./models/Contact");
const { response } = require('express');
const notFound = require('./middlewares/notfound')
const handleErrors = require('./middlewares/handleError')

app.use(cors())
app.use(express.json())



const generateId = () => {
    const maxId = contacts.length > 0
     ? Math.max(...contacts.map(n => n.id))
     : 0
    return maxId + 1
}

app.get('/', (request, response) => {
    response.status(200).send('<h1>Hello World</h1>')
})

app.get('/api/info', (request,response) => {
    let s = `<p>Phonebook has info for  ${contacts.length} people</p><p>${new Date()}`
    response.status(200).send(s)
})

app.get('/api/contacts', (request, response) => {
    Contact.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/contacts/:id', (request, response,next) => {
    const {id} = request.params
    Contact.findById(id).then(contact => {
        if(contact) {
            response.status(200).json(contact)
        } else {
            response.status(404).end()
        }
        
    }).catch(err => {
        next(err)
    })
})

app.post('/api/contacts', (request, response) => {
    const body = request.body
    if(!body.name) {
        return response.status(400).json({
            error: 'missing name'
        })
    }
    if(!body.number) {
        return response.status(400).json({
            error: 'missing number'
        })
    }
    let repeat = []
    Contact.find({}).then(contacts => {
         repeat = contacts.filter(contact => contact.name === body.name)
    })

     if(repeat.length > 0) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const newContact = new Contact({
        name: body.name,
        number: body.number,
    })
    
    newContact.save().then(savedContact => {
        response.status(201).json(savedContact);
    })
    
})

app.delete('/api/contacts/:id', (request, response,next) => {
    const {id} = request.params
    
    Contact.findByIdAndRemove(id).then(result => {
        response.status(204).end()
    }).catch(err => next(err))
})

app.put('/api/contacts/:id', (request,response,next) => {
    const {id} = request.params
    const contact = request.body
    const newNoteInfo = {
        name: contact.name,
        number: contact.number
    }
    Contact.findByIdAndUpdate(id,newNoteInfo, {new:true})
        .then(result =>  {
            response.status(200).json(result)
        }).catch(err => {
            next(err)
        })
})


app.use(notFound)
app.use(handleErrors)



const PORT = process.env.PORT

app.listen(PORT,() => {
    console.log("Server running in port 3001")
})
