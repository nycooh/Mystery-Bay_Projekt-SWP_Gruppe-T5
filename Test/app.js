const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const RegisterController = require('./src/controllers/registerController');
const LoginController = require('./src/controllers/loginController');


const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'src/data/users.json');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public')));

const registerController = new RegisterController();
const loginController = new LoginController();


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.post('/register', (req, res) => registerController.registerUser(req, res));
app.post('/login', (req, res) => loginController.loginUser(req, res));


app.post('/finalize-register', async (req, res) => {
  const { username, password, email, role } = req.body;

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  }


  const newUser = {
      username,
      password,
      email,
      role,
      verified: false,
  };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
});

app.get('/verify', (req, res) => {
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE));
    }
    const user = users.find(u => u.token === token);
    if (user) {
        user.verified = true;
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        res.send('<h1>Dein Account wurde erfolgreich verifiziert!</h1>');
    } else {
        res.send('<h1>Ungültiger oder abgelaufener Token!</h1>');
    }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
