// eslint-disable-next-line no-unused-vars
module.exports = function processMessage(options = {}) {
  return async context => {

    const { data } = context;

    // throw error if text not received
    if(!data.text){
      throw new Error('A message should have text field');
    }

    // extract the authenticated user
    const user = context.params.user;

    // extract the message and limit to 400 characters
    const text = context.data.text.substring(0, 400);

    // override the original data, so no extra props are stored in the database
    context.data = {
      text,
      userId: user._id,
      createdAt: new Date().getTime()
    };

    return context;
  };
};
