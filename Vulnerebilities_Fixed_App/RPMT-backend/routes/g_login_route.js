
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
    const frontendRedirectUrl = "http://localhost:3000/stdHome";
    res.redirect(`${frontendRedirectUrl}?success=true`);
  });
  app.get("/auth/google/failure", (req, res) => {
    const frontendRedirectUrl = "http://localhost:3000/login";
    res.redirect(`${frontendRedirectUrl}?success=true`);
  });
};
