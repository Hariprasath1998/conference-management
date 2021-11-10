const User = require('../models/User');

module.exports = async function (req, res, next) {
  const isAdmin = await User.findById(req.user.id).select('isAdmin');

  if (isAdmin) {
    console.log('Admin True');
    next();
  } else {
    return res.status(401).json({ msg: 'Not an Admin' });
  }
};
