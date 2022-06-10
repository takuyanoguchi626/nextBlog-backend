const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { mysqlTool, sql } = require("./client.js");
const bcrypt = require("bcrypt");

let initialize;
let authenticate;
let authorize;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  "localStrategy",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      console.log(email);
      console.log(password);
      let results, user;

      try {
        results = await mysqlTool(await sql("SELECT_USER_BY_EMAIL"), [email]);
      } catch (error) {
        return done(error);
      }
      console.log(results);
      if (results.length === 1) {
        bcrypt.compare(password, results[0].password, function (err, result) {
          if (result) {
            user = {
              id: results[0].id,
              name: results[0].name,
              email: results[0].email,
              permissions: ["normal"],
            };
            console.log(user);
            done(null, user);
          } else {
            done(null, false);
          }
        });
      } else {
        done(null, false);
      }
    }
  )
);

initialize = function () {
  return [passport.initialize(), passport.session()];
};

authenticate = () => {
  return passport.authenticate("localStrategy", {
    failureRedirect: "/user/login/failure",
  });
};

module.exports = {
  initialize,
  authenticate,
  authorize,
};
