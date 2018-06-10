"use strict";

import express from "express";
import handlebars from "express-handlebars";
import path from 'path';
import session from "express-session";
import bodyParser from "body-parser";

import db from "./helpers/database";
import passport from "./helpers/passport";
 
// Routers
import index from "./Routes/index";
import login from "./Routes/login";
import upload from "./Routes/upload";

const app = express();

// Load views
app.engine ("hbs", handlebars ({ 
    defaultLayout: __dirname + "/views/main",
    extname: "hbs"
}));
app.set ("view engine", "hbs");
app.set('views', path.join(__dirname, "views"));

// Static files
// app.use(express.static(path.join(__dirname, "public")));

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "lewd.se",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user ? req.user : null;
    console.log(res.locals.user);
    next()
});

// Set the routes
app.use("/", index);
app.use("/login", login);
app.use("/upload", upload);


app.listen(8080, () => console.log("It's up and running :3"));