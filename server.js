require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieP = require("cookie-parser")
const express = require("express");
const db = require("better-sqlite3")("OurApp.db")
db.pragma("journal_mode = WAL")

// database setup here

const createTables = db.transaction(() => {
    db.prepare(
    `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username STRING NOT NULL UNIQUE,
    password STRING NOT NULL
    )    
    `
    ).run()  
})

createTables()

// database ends here

const app = express()

app.set("view engine" , "ejs");
app.use(express.urlencoded({extended: false}))
app.use(express.static("public"))
app.use(cookieP())


app.use(function (req, res, next) {
    res.locals.error = []

    //try to decode incoming cookie
    try {
        const decoded = jwt.verify(req.cookies.ourSimpleApp, process.env.JWTSECRET)
        req.user = decoded
    } catch (error) {
        req.user = false
    }

    res.locals.user = req.user
    console.log(req.user)
    next()
})


app.get("/", (req, res) => {
    res.render("homepage")
})

app.get("/login", (req,res) => {
    res.render("login")
})

app.post("/register", (req, res) => {
    const error = []

    if(typeof req.body.username !== "string") {
        req.body.username = ""
    }
    if(typeof req.body.password !== "string") {
        req.body.password = ""
    }
    req.body.username = req.body.username.trim()

    
    if(!req.body.username) error.push("You must provide a username")
    if(req.body.username && req.body.username.length < 3) error.push("Username must have at least three characters")
    if(req.body.username && req.body.username.length > 10) error.push("Username should not longer than three characters")
    if(req.body.username && !req.body.username.match(/^[a-zA-Z0-9]+$/)) error.push("Username can contain only letters or numbers")

    if(!req.body.password) error.push("You must provide a password")
    if(req.body.password && req.body.password.length < 8) error.push("Password must have at least 八 characters")
    if(req.body.password && req.body.password.length > 70) error.push("Password should not longer than 七十 characters")

    if (error.length) {
        return res.render("homepage", {error})
    }

    const salt = bcrypt.genSaltSync(10)
    req.body.password = bcrypt.hashSync(req.body.password, salt)

    // save the username into database
    const ourStatement = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)")
    const result = ourStatement.run(req.body.username, req.body.password)

    const lookupstatement = db.prepare("SELECT * FROM users where ROWID = ?")
    const ourUser = lookupstatement.get(result.lastInsertRowid)
    // log the user in by giving them a cookie
    const ourTokenValue = jwt.sign ({exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, skyColor: "Blue", userid: ourUser.id, username: ourUser.username}, process.env.JWTSECRET)
    res.cookie("ourSimpleApp", ourTokenValue, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24
    })
    res.send("Thank you!")
})

app.listen(3000)