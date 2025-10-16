const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, '../data/users.json');

class LoginController {
    loginUser(req, res) {
        const { username, password } = req.body;

        if (!fs.existsSync(USERS_FILE)) {
            return res.send(makeSwalHtml({
                icon: 'warning',
                title: 'Keine Benutzer registriert',
                text: 'Bitte registriere dich zuerst!',
                redirect: '/register.html'
            }));
        }

        let users;
        try {
            users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        } catch (err) {
            console.error('Fehler beim Lesen users.json', err);
            return res.status(500).send('Serverfehler');
        }

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            return res.send(makeSwalHtml({
                icon: 'success',
                title: `Willkommen, ${user.username}!`,
                text: 'Login erfolgreich 🎉',
                redirect: '/main.html'
            }));
        } else {
            return res.send(makeSwalHtml({
                icon: 'error',
                title: 'Fehler',
                text: 'Benutzername oder Passwort ist falsch!',
                redirect: '/login.html'
            }));
        }
    }
}


function makeSwalHtml({ icon, title, text, redirect }) {
    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Login</title>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
  <script>
    Swal.fire({
      icon: ${JSON.stringify(icon)},
      title: ${JSON.stringify(title)},
      text: ${JSON.stringify(text)},
      timer: 5000,             // automatisch nach 5s schließen
      showConfirmButton: false,// kein OK-Button
      allowOutsideClick: false
    });

    setTimeout(() => {
      window.location.href = ${JSON.stringify(redirect)};
    }, 5000);
  </script>
</body>
</html>`;
}

module.exports = LoginController;
