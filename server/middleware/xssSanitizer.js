const sanitizeHtml = require('sanitize-html');

const sanitizeXSS = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [], // No HTML tags allowed
          allowedAttributes: {}, // No attributes allowed
          disallowedTagsMode: 'recursiveEscape'
        });
      }
    });
  }
  next();
};

module.exports = sanitizeXSS;