const feathers = require('@feathersjs/feathers');
const { BadRequest } = require('@feathersjs/errors');

class Messages {

    constructor(){
        this.messages = [];
        this.currentId = 0;
    }

    async find(params){
        // return list of parameters
        return this.messages;
    }

    async get(id, params){
        // find message by id
        const message = this.messages.find(
            message => message.id === parseInt(id, 10)
        );

        if(!message){
            throw new Error(`Message with id ${id} not found`)
        }

        return message;
    }

    async create(data, params){
        const message = Object.assign({
            id: ++this.currentId
        }, data);

        this.messages.push(message);

        return message;
    }

    async patch(id, data, params){
        const message = await this.get(id);

        return Object.assign(message, data);
    }

    async remove(id, params){
        const message = await this.get(id);

        const index = this.messages.indexOf(message);

        this.messages.slice(index, 1);

        return message;
    }
};

const app = feathers();

app.use('messages', new Messages());

// hooks
const setTimeStamp = name => {
  return async context => {
      context.data[name] = new Date();

      return context;
  }
};

const validate = async context => {
  const { data} = context;

  if(!data.text){
      throw new BadRequest('Message text must exist');
  }

  if(typeof data.text !== 'string' || data.text.trim() === ''){
      throw new BadRequest('Message text is invalid');
  }

  // change data to only text, removing all the other props
  context.data = {
    text: data.text.toString()
  };

  return context;
};

app.hooks({
    error: async context => {
        console.error(`Error in '${context.path}' service method '${context.method}'`, context.error.stack);
    }
});

// testing
async function processMessages(){

    app.service('messages').on('created', message => {
        console.log('Created a new message: ', message);
    });

    app.service('messages').on('removed', message => {
        console.log('Deleted message: ', message);
    });

    app.service('messages').hooks({
        before: {
            create: [setTimeStamp('createdAt'), validate],
            update: [setTimeStamp('updatedAt'), validate],
        }
    });

    await app.service('messages').create({
       text: 'First message'
    });

    const lastMessage = await app.service('messages').create({
        text: 'Second message'
    });

    await app.service('messages').remove(lastMessage.id);

    const messageList = await app.service('messages').find();

    console.log('Available messages: ', messageList);
}

processMessages();