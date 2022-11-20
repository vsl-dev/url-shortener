const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "179898243453-v94bhcq0ic2i8460vc798itean4grhi5.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3500/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));