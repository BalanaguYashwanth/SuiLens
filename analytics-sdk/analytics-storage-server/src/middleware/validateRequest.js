const ApiError = require('../errors/ApiError');

function validateRequest(requiredFields = []) {
  return (req, res, next) => {
    const body = req.body || {};
    const missingFields = requiredFields.filter(field => !(field in body));
    if (missingFields.length > 0) {
      return next(new ApiError(400, `Missing fields: ${missingFields.join(', ')}`));
    }
    next();
  };
}

module.exports = validateRequest;