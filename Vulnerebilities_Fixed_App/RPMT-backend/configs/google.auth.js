const GoogleStrategy = require("passport-google-oauth2");
const User = require("../model/user.model");
const logger = require("../utils/logger");

const fs = require('fs');
const ini = require('ini');

// Read the contents of the config.ini file
const configPath = '/Users/pasindushv/Desktop/SSD-PROJ-REPO/Y4S2_SSD_ASSIGNMENT/Vulnerebilities_Fixed_App/RPMT-backend/config.ini';
const configData = fs.readFileSync(configPath, 'utf-8');

// Parse the ini data
const config = ini.parse(configData);

// Get Secure Details
const clId = config.SectionOne.clientID;
const clSec = config.SectionOne.clientSecret;

const googleAuth = (passport) => {
  GoogleStrategy.Strategy;
  passport.use(
    new GoogleStrategy(
      {
        clientID: clId,
        clientSecret: clSec,
        callbackURL: "http://localhost:8090/auth/google/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, callback) => {
        try {
          const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          };
          let user = await User.findOne({ googleId: profile.id });

          if (user) return callback(null, user);

          user = await User.create(newUser);
          return callback(null, user);
        } catch (error) {
          logger.error(error.message);
        }
      }
    )
  );

  passport.serializeUser((user, callback) => {
    return callback(null, user);
  });

  passport.deserializeUser((id, callback) => {
    User.findById(id, (err, user) => {
      return callback(err, user);
    });
  });
};

module.exports = { googleAuth };
