const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Verify token
  try {
    await jwt.verify(token, config.jwtSecret, (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: 'Token is not valid' });
      } else {
        if (!decoded.user.id) {
          return res.status(400).send({ error: 'Malformed JWT' });
        } else {
          if (decoded.user.id != req.params.employerID) {
            return res.status(401).json({ error: 'Token is not valid user' });
          }
        }
        next();
      }
    });
  } catch (err) {
    console.error('Something wrong with auth middleware');
    return res.status(500).json({ error: 'Server Error' });
  }
};
