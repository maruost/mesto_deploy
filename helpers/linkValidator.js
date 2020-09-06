const validator = require('validator');

const linkValidator = (link) => {
  if (!validator.isURL(link)) {
    throw new Error('link is invalid');
  }
  return link;
};

module.exports = linkValidator;
