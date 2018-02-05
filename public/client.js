const app = feathers();

app.use('todos', {
   async get(name){
       // return object
       return {
         name,
         text: `You have to ${name}`
       };
   }
});

// a function that gets and logs the todos from the service
async function logTodo(name) {
    const service = app.service('todos');
    const todo = await service.get(name);
    console.log(todo);
};

logTodo('browserTest');