/* eslint-disable security/detect-object-injection */
const sanitizeHtml = require('sanitize-html');

const sanitizeXSS = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitizedBody = {};
    const allowedKeys = Object.keys(req.body);
    
    allowedKeys.forEach(key => {
      const value = req.body[key];
      if (typeof value === 'string') {
        sanitizedBody[key] = sanitizeHtml(value, {
          allowedTags: [], // No HTML tags allowed
          allowedAttributes: {}, // No attributes allowed
          disallowedTagsMode: 'recursiveEscape'
        });
      } else {
        sanitizedBody[key] = value;
      }
    });
    
    req.body = sanitizedBody;
  }
  next();
};

module.exports = sanitizeXSS;