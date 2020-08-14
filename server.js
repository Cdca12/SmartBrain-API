const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();

const database = {
    users: [
        {
            id: "1",
            name: "Carlos",
            username: "Cdca",
            password: "admin",
            entries: 0,
            joined: new Date()
        },
        {
            id: "2",
            name: "Sally",
            username: "sallygh",
            password: "sally123",
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: "5",
            has: "",
            username: "cdca"
        }
    ]
}

// BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const findUserById = (id) => {
    id = id.toString();
    return database.users.find(user => user.id === id);
}

const findUser = (username, password) => {
    let user = database.users.find(user => {
        return username.toLowerCase() === user.username.toLowerCase()
            && password === user.password
    });
    return user;
}

// Test and GET all database users
app.get("/", (req, res) => {
    res.json(database.users);
});

app.post("/signin", (req, res) => {
    let user = findUser(req.body.username, req.body.password);

    if (!user) {
        res.status(400).json("Login error");
    } else {
        res.json(user);
    }

});

app.post("/register", (req, res) => {
    let { name, username, password } = req.body;
    let lastID = Number(database.users[database.users.length - 1].id);


    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log("Bcrypt error!", err);
        }
        // Store hash in your password DB.
        console.log(hash);
    });

    let user = {
        id: (lastID + 1).toString(),
        name: name,
        username: username,
        password: password,
        entries: 0,
        joined: new Date()
    }

    // TODO: Que la respuesta no contenga password

    database.users.push(user);
    delete user.password;

    res.json(user);
});

app.get("/profile/:id", (req, res) => {
    let user = findUserById(req.params.id);

    if (!user) {
        res.status(404).send("Can't find an user with that ID!");
        return;
    }
    res.json(user);
});

app.put("/image", (req, res) => {
    let user = findUserById(req.body.id);

    if (!user) {
        res.status(404).send("Can't find an user with that ID!");
        return;
    }
    user.entries++;
    res.json(user);

});

app.listen(3000, () => {
    console.log("App is running on port 3000");
});


// To hash a password


// To check a password

// Load hash from your password DB.
// bcrypt.compare("B4c0/\/", hash, function (err, res) {
//     // res === true
// });
// bcrypt.compare("not_bacon", hash, function (err, res) {
//     // res === false
// });

// // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
// bcrypt.compare("B4c0/\/", hash).then((res) => {
//     // res === true
// });



// TODO, full implement bcrypt, hash password and search id to find hash en signin successfuly