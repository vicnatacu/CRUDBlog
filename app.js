const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require("connect-mongo")(session)
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const postRouter = require('./routes/posts_routes');
const authRouter = require('./routes/auth_routes');
const userRouter = require('./routes/user_routes');


const port = process.env.PORT || 3007;

const app = express()
app.use(cors())
app.use(bodyParser.json())



const dbConn = process.env.MONGODB_URI || "mongodb://localhost/blog_app"
// const dbConn = "mongodb+srv://vicnatacu:krambear36@vicnatacu-ra5zk.mongodb.net/blog_app?retryWrites=true&w=majority"
// Set three properties to avoid deprecation warnings:
// useNewUrlParser: true
// useUnifiedTopology: true
// useFileAndModify: false
mongoose.connect(
	dbConn,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	},
	err => {
		if (err) {
			console.log("Error connecting to database", err)
		} else {
			console.log("Connected to database!")
		}
	}
)

app.use(
	session({
		// resave and saveUninitialized set to false for deprecation warnings
		secret: "Express is awesome",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1800000
		},
		store: new MongoStore({
			mongooseConnection: mongoose.connection
		})
	})
)

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
	console.log("get on /")
	// req.session.timesVisited ? req.session.timesVisited++ : (req.session.timesVisited = 1)
	// res.send(`You have visited ${req.session.timesVisited} times!`)
	console.log('req.session', req.session);
	res.send('got your request');
})

app.use("/posts", postRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter)

app.listen(port, () => {
	console.log(`Blog express app listening on port ${port}`)
})