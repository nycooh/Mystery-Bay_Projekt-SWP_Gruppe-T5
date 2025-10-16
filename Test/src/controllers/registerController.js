const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, '../data/users.json');
const User = require('../models/user'); 

class RegisterController {
    registerUser(req, res) {
        const { username, password, email } = req.body;

        let users = [];
        if (fs.existsSync(USERS_FILE)) {
            try {
                users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
            } catch (err) {
                console.error('Fehler beim Lesen von users.json:', err);
                return res.status(500).send('Serverfehler');
            }
        }

        
        if (users.find(u => u.username === username)) {
            return res.send(makeSwalHtml({
                icon: 'error',
                title: 'Benutzername existiert schon',
                text: 'Bitte wähle einen anderen Benutzernamen.',
                redirect: '/register.html'
            }));
        }

        return res.send(makeRoleChoiceHtml({ username, password, email }));
    }
}


function makeRoleChoiceHtml({ username, password, email }) {
    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rollenwahl</title>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
  <script>
    Swal.fire({
      title: 'Bist du Käufer oder Verkäufer?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Käufer',
      denyButtonText: 'Verkäufer',
      allowOutsideClick: false
    }).then((result) => {
      let role = null;
      if (result.isConfirmed) {
        role = "Käufer";
      } else if (result.isDenied) {
        role = "Verkäufer";
      }

      if (role) {
        fetch('/finalize-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: ${JSON.stringify(username)},
            password: ${JSON.stringify(password)},
            email: ${JSON.stringify(email)},
            role
          })
        })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Registrierung erfolgreich',
            text: 'Du kannst dich jetzt einloggen.',
            timer: 3000,
            showConfirmButton: false
          });
          setTimeout(() => window.location.href = '/login.html', 3000);
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Fehler',
            text: 'Speichern fehlgeschlagen!'
          });
        });
      }
    });
  </script>
</body>
</html>`;
}

module.exports = RegisterController;