const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;


app.use(bodyParser.json());

const readContacts = () => {
  const data = fs.readFileSync('data.json', 'utf-8');
  return JSON.parse(data);
};


const writeContacts = (contacts) => {
  fs.writeFileSync('data.json', JSON.stringify(contacts, null, 2), 'utf-8');
};

// 1. List Contacts
app.get('/contacts', (req, res) => {
  const contacts = readContacts();
  res.json(contacts);  
});

// 2. Add Contact
app.post('/contacts', (req, res) => {
  const { name, phone, image } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ message: "Name and Phone are required!" });
  }
  

  const contacts = readContacts();
  const newContact = {
    id: contacts.length + 1,
    name,
    phone,
    image: image || null 
  };
  
  contacts.push(newContact);
  writeContacts(contacts);
  res.status(201).json({ message: "Contact added successfully!" });
});

// 3. Update Contact
app.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, image } = req.body;


  const contacts = readContacts();
  

  const contact = contacts.find(c => c.id === parseInt(id));
  if (!contact) {
    return res.status(404).json({ message: "Contact not found!" });
  }

  contact.name = name || contact.name;
  contact.phone = phone || contact.phone;
  contact.image = image || contact.image;

  writeContacts(contacts);
  res.json({ message: "Contact updated successfully!" });
});

// 4. Delete Contact
app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const contacts = readContacts();
  const index = contacts.findIndex(c => c.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: "Contact not found!" });
  }
  contacts.splice(index, 1);  
  writeContacts(contacts);
  res.json({ message: "Contact deleted successfully!" });
});

// 5. Search Contact
app.get('/contacts/search', (req, res) => {
  const { name, phone } = req.query;
  const contacts = readContacts();
  const result = contacts.filter(contact => {
    return (
      (name && contact.name.toLowerCase().includes(name.toLowerCase())) ||
      (phone && contact.phone.includes(phone))
    );
  });
  res.json(result); 
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
