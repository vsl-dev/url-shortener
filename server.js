const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const url = require("url");
const ejs = require("ejs");
const path = require("path");
require("./passport-setup");
const { JsonDatabase } = require("wio.db");

const db = new JsonDatabase({
  databasePath: "./databases/database.json",
});

global.db = db;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine("html", ejs.renderFile);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.set("json spaces", 1);
app.use(
  cookieSession({
    name: "vsldev",
    keys: ["key1", "key2"],
    maxAge: 120 * 60 * 60 * 1000,
  })
);
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};
app.use(passport.initialize());
app.use(passport.session());

app.get("/user", (req, res) => {
  res.send(req.user);
});

app.get(
  "/login",
  (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;
    } else if (req.query.r) {
      const url = req.query.r;
      req.session.backURL = url;
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer).pathname;
      req.session.backURL = parsed;
    } else {
      req.session.backURL = "/";
    }
    next();
  },
  (req, res) => {
    res.redirect("/auth/google");
  }
);

app.get("/auth/failed", (req, res) => res.send("You Failed to log in!"));

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failed" }),
  function (req, res) {
    console.log(req.user);
    res.redirect(req.session.backURL || "/");
  }
);

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

// Pages

app.get("/", (req, res) => {
  res.render("index", {
    user: req.user,
  });
});

app.use("/api", require("./routes/api"));

// 404

app.get("/*", (req, res) => {
  res.json({ code: 404, message: "Not found" });
});

app.listen(3500, () =>
  console.log(`App listening on port http://localhost:3500 \n Github: vsl-dev`)
);
