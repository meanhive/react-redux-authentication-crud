const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const assert = require("assert");
const expressSession = require("express-session");
const appRoute = require("./route/userroute");
const mongoose = require("mongoose");
const mongoConfig = require("./db/config");

const app = express();

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//mongo db
mongoose.Promise = global.Promise;

mongoose
  .connect(mongoConfig.dbUri, { useNewUrlParser: true })
  .then((res) => {
    console.log(`Database connected`);
  })
  .catch((err) => {
    assert.equal(null, err);
  });

app.use(
  expressSession({
    secret: require("./config.json").secret,
    saveUninitialized: true,
    resave: true,
  })
);

const PORT = Number(process.env.PORT || 3344);

app.use("/", appRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
