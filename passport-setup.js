const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const DiscordStrategy = require("passport-discord").Strategy;
const config = require("./config");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.auth.google.clientID,
      clientSecret: config.auth.google.clientSecret,
      callbackURL: config.auth.google.callbackURL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.use(
  new DiscordStrategy(
    {
      clientID: config.auth.discord.clientID,
      clientSecret: config.auth.discord.clientSecret,
      callbackURL: config.auth.discord.callbackURL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
