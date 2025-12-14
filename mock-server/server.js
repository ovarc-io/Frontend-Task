const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const fs = require('fs');
const path = require('path');

// Load initial data from public/data
const loadData = () => {
  const dataPath = path.join(__dirname, '..', 'public', 'data');
  return {
    stores: JSON.parse(fs.readFileSync(path.join(dataPath, 'stores.json'), 'utf8')),
    books: JSON.parse(fs.readFileSync(path.join(dataPath, 'books.json'), 'utf8')),
    authors: JSON.parse(fs.readFileSync(path.join(dataPath, 'authors.json'), 'utf8')),
    inventory: JSON.parse(fs.readFileSync(path.join(dataPath, 'inventory.json'), 'utf8')),
  };
};

// Initialize db.json
const dbPath = path.join(__dirname, 'db.json');
let db;

if (!fs.existsSync(dbPath)) {
  const initialData = loadData();
  db = {
    ...initialData,
    users: [
      {
        id: 1,
        username: "admin",
        password: "admin123",
        email: "admin@bookstore.com",
        name: "Admin User"
      },
      {
        id: 2,
        username: "user",
        password: "user123",
        email: "user@bookstore.com",
        name: "Regular User"
      }
    ]
  };
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
} else {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  if (!db.stores || db.stores.length === 0) {
    const initialData = loadData();
    db = { ...db, ...initialData };
    if (!db.users) {
      db.users = [
        { id: 1, username: "admin", password: "admin123", email: "admin@bookstore.com", name: "Admin User" },
        { id: 2, username: "user", password: "user123", email: "user@bookstore.com", name: "Regular User" }
      ];
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }
}

const router = jsonServer.router(dbPath);

server.use(middlewares);
server.use(jsonServer.bodyParser);

// CORS headers
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Authentication routes
server.post('/auth/signin', (req, res) => {
  const currentDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const { username, password } = req.body;
  const user = currentDb.users?.find(u => u.username === username && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token: `mock-token-${user.id}` });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

server.post('/auth/signout', (req, res) => {
  res.json({ message: 'Signed out successfully' });
});

server.get('/auth/me', (req, res) => {
  const currentDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && token.startsWith('mock-token-')) {
    const userId = parseInt(token.replace('mock-token-', ''));
    const user = currentDb.users?.find(u => u.id === userId);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});

