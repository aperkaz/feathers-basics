// use it create a MD5 hash
const crypto = require('crypto');

// Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar';
const query = 's=60';


// eslint-disable-next-line no-unused-vars
module.exports = function gravatar(options = {}) {
  return async context => {

    const { email } = context.data;

    // use hash from email to pick the image from Gravatar service
    const hash = crypto.createHash('md5').update(email).digest('hex');

    context.data.avatar = `${gravatarUrl}/${hash}?${query}`;

    // always return the context as best practice
    return context;
  };
};
