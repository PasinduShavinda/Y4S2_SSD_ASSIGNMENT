const { authenticate } = require("../middleware/auth.middleware");

module.exports = function (app, passport) {
  app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/auth/google/success",
      failureRedirect: "/auth/google/failure",
    })
  );
  app.get("/auth/google/success", (req, res) => {
    return res.send("Login success");
  });
  app.get("/auth/google/failure", (req, res) => {
    return res.send("Authentication failed");
  });

  app.get("/test", authenticate, (req, res) => {
    console.log(req.isAuthenticated());
    res.send("<h1>User is authenticated</h1>");
  });
};
