const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { mysqlTool, sql } = require("./client.js");

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
      usernameField: "username",
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
      if (
        results.length === 1 &&
        bcrypt.compareSync(password, results[0].password)
      ) {
        user = {
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
          permissions: [normal],
        };
        done(null, user);
      } else {
        done(
          null,
          false,
          req.flash("message", "ユーザー名 または パスワードが間違っています")
        );
      }
    }
  )
);

initialize = function () {
  return [
    passport.initialize(),
    passport.session(),
    function (req, res, next) {
      console.log(req.user);
      if (req.user) {
        res.locals.user = req.user;
      }
      next();
    },
  ];
};

authenticate = () => {
  return passport.authenticate("localStrategy", {
    successRedirect: "/user/login/success",
    failureRedirect: "/user/login/failure",
  });
};

module.exports = {
  initialize,
  authenticate,
  authorize,
};
