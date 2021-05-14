const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const getUser = users.find(user => user.username === username);
  
  if(!getUser) {
    return response.status(404).json({ error: "User not found"});
  }
  
  request.username = username;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some(user => user.username === username);

  if(userAlreadyExists) {
    return response.status(400).json({error: 'User already exists'});
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request;

  const getUser = users.find(user => user.username === username);

  const todos = getUser.todos;

  return response.json(todos);
});

app.get('/users', (request, response) => {
  return response.json(users);
})

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request;

  const getUser = users.find(user => user.username === username);

  if(getUser === undefined) {
    return response.status(404).json({ error: "User not found"});
  }

  todo = {
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  getUser.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request;
  const { title, deadline } = request.body;

  const getUser = users.find(user => user.username === username);

  if(!getUser) {
    return response.status(404).json({ error: "User not found"});
  }

  const userTodo = getUser.todos.find(todo => todo.id === id);

  if(!userTodo) {
    return response.status(404).json({error: 'Todo not found'})
  }

  userTodo.title = title;
  userTodo.deadline = deadline;

  return response.json(userTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  const getUser = users.find(user => user.username === username);

  if(!getUser) {
    return response.status(404).json({ error: "User not found"});
  }

  const userTodo = getUser.todos.find(todo => todo.id === id);

  if(!userTodo) {
    return response.status(404).json({error: 'Todo not found'})
  }

  userTodo.done = true;

  return response.json(userTodo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  const getUser = users.find(user => user.username === username);

  if(!getUser) {
    return response.status(404).json({ error: "User not found"});
  }

  const userTodo = getUser.todos.find(todo => todo.id === id);

  if(!userTodo) {
    return response.status(404).json({error: 'Todo not found'})
  }

  const removeTodo = getUser.todos.splice(userTodo, 1);
  
  users.push(removeTodo);

  return response.status(204).send();
});

module.exports = app;