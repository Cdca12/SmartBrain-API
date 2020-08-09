const express = require("express");

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
    ]
}

// BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("This is working");
});

app.post("/signin", (req, res) => {
    let userExists = database.users.some(user => {
        return req.body.username.toLowerCase() === user.username.toLowerCase()
            && req.body.password === user.password
    }
    );

    if (userExists) {
        res.json("Login Success!");
    } else {
        res.status(400).json("Login error");
    }

});

app.post("/register", (req, res) => {
    let lastID = Number(database.users[database.users.length - 1].id);

    let { name, username, password } = req.body;

    let user = {
        id: (lastID + 1),
        name: name,
        username: username,
        password: password,
        entries: 0,
        joined: new Date()
    }

    database.users.push(user);

    res.json(user);
    // res.send("Signed up succesfuly!");
});


// Test and GET all database
app.get("/test", (req, res) => {
    res.json(database);
});


app.listen(3000, () => {
    console.log("App is running on port 3000");
});


/*
/ --> res = this is working                 OK
/signin     --> POST = success/fail         OK
/register   --> POST = user                 OK
/profile/:userId --> GET = user
/image --> PUT --> user (count)
*/