const feathers = require('@feathersjs/feathers');

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



async function processMessages(){

    app.service('messages').on('created', message => {
        console.log('Created a new message: ', message);
    });

    app.service('messages').on('removed', message => {
        console.log('Deleted message: ', message);
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