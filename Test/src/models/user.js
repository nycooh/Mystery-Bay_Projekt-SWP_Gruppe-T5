class User {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    static validate(user) {
        if (!user.username || !user.password) {
            throw new Error("Username and password are required.");
        }
        
    }
}

module.exports = User;