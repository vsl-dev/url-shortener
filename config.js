const config = {
  version: 1.0,
  name: "Url Shortener",
  creator: "https://github.com/vsl-dev",
  auth: {
    google: {
      clientID:
        "179898243453-v94bhcq0ic2i8460vc798itean4grhi5.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3500/auth/google/callback",
    },
    discord: {
      clientID: "776536871287259146",
      clientSecret: "M2mE2uXV71kFLjTVXfp0G3g1-B-5omxK",
      callbackURL: "http://localhost:3500/auth/discord/callback",
    },
  },
};

module.exports = config;