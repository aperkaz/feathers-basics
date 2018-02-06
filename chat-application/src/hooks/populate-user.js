// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function populateUser(options = {}) {
  return async context => {

    // get 'app', 'method', 'params' and 'result' from the hook context
    const { app, method, params, result } = context;

    const messages = method === 'find' ? result.data : [result];

    // get user object for each userId

    await Promise.all(messages.map( async message => {
      const user = await app.service('users').get(message.userId, params);

      message.user = user;
    }));


    return context;
  };
};
