const express = require('express')
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

let contacts = [
    {
        id: 0,
        name:"Arton",
        number:"123"
    },
    {
        id: 1,
        name:"Alex",
        number:"123123"
    }
]

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
    response.status(200).json(contacts)
})

app.get('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)
    response.status(200).json(contact)
})

app.post('/api/contacts', (request, response) => {
    const body = request.body
    console.log(body);
    
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
    if (contacts.filter(contact => contact.name === body.name).length !== 0 ) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const contact = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    
    contacts = contacts.concat(contact);
    console.log(contacts);
    response.status(201).json(contact);
})

app.delete('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    
    console.log(id)
    contacts = contacts.filter(contact => contact.id !== id)
    response.status(204).json({deleted:`deleted ${id}`})
})

const PORT = process.env.PORT || 3001

app.listen(PORT,() => {
    console.log("Server running in port 3001")
})
