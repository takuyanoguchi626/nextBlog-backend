const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { mysqlTool, sql } = require("./client.js");

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
      let results, user;
      try {
        results = await mysqlTool(await sql(""), [email]);
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
