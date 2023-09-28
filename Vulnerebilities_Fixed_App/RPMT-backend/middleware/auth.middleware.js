const authenticate = (req, res, next) => {
  console.log(req.session.passport);
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send("<h1>User is not authenticated</h1>")
  }
};

module.exports = { authenticate };
