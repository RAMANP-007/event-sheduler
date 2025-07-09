const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.REDIRECT_URI,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // User already exists with Google ID, update tokens
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            await user.save();
            return done(null, user);
          }

          // If no user with Google ID, check if a user exists with that email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // User with that email exists, link the Google account
            user.googleId = profile.id;
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            await user.save();
            return done(null, user);
          }

          // No user found at all, create a new one
          const newUser = await User.create({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
          done(null, newUser);
        } catch (err) {
          console.error('Error in Google OAuth strategy:', err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
