// create api to serve json files from public/data folder using express.js
import express from 'express';
import fs from 'fs';

const app = express();
const port = 3000;

// Middleware setup
app.use(express.json());


app.get('/api/data/:file', (req, res) => {
    const file = req.params.file;
    const data = fs.readFileSync(`../public/data/${file}`, 'utf8');
    res.json(JSON.parse(data));
});

app.post('/api/data/:storeId/new-book', (req, res) => {
    const storeId = req.params.storeId;
    if(!storeId) {
        res.status(400).json({ error: 'Store ID is required' });
        return;
    }
    const books = fs.readFileSync(`../public/data/books.json`, 'utf8');
    const booksData = JSON.parse(books);
    const book = booksData.find(book => book.id === req.body.bookId);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    const stores = fs.readFileSync(`../public/data/stores.json`, 'utf8');
    const storesData = JSON.parse(stores);
    const store = storesData.find(store => store.id === storeId);
    if(!store) {
        res.status(404).json({ error: 'Store not found' });
        return;
    }
    store.books.push(book);
    fs.writeFileSync(`../public/data/stores.json`, JSON.stringify(storesData, null, 2));
    res.status(201)
});


app.post('/api/sign-in', (req, res) => {
    const { email, password } = req.body;
    const users = fs.readFileSync(`../public/data/users.json`, 'utf8');
    const usersData = JSON.parse(users);
    const user = usersData.find(user => user.email === email && user.password === password);
    if(!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    res.status(200).json(user);
});
app.post('/api/sign-out', (req, res) => {
    // sign-out logic here 
    res.status(200).json({ message: 'Signed out successfully' });
    return;
});
app.listen(port, () => { 
    console.log(`Server is running on port ${port}`);
});
