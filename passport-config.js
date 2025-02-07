const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./config/db'); // Ensure this path is correct

function initialize(passport) {
  // Serialize user - determines what user data is stored in the session
  passport.serializeUser((user, done) => {
    done(null, user.id); // Store only the user ID in the session
  });

  // Deserialize user - retrieves the full user data based on the ID stored in the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Retrieve user by ID from MongoDB
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Local strategy for login
  passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'No user with that email' });
        }

        // Compare entered password with hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          return done(null, user); // User is authenticated successfully
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      } catch (err) {
        return done(err);
      }
    }
  ));
}

module.exports = initialize;
