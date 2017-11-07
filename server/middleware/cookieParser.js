const parseCookies = (req, res, next) => {
  let cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split('; ').forEach(cookie => {
      let tuple = cookie.split('=');
      cookies[tuple[0]] = tuple[1];
    });
  }
  req.cookies = cookies;
  next();
};

module.exports = parseCookies;