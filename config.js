const config = {
  version: 2.0,
  name: "Url Shortener",
  creator: "https://github.com/vsl-dev",
  auth: {
    google: {
      clientID: "GOOGLE CLIENT ID",
      clientSecret: "GOOGLE CLIENT SECRET",
      callbackURL: "GOOGLE CALLBACK URL",
    },
    discord: {
      clientID: "DISCORD CLIENT ID",
      clientSecret: "DISCORD CLIENT SECRET",
      callbackURL: "DISCORD CALLBACK URL",
    },
  },
};

module.exports = config;