const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

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
    id: "123",
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(200).json(user);
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

  todo = {
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  getUser.todos.push(todo);

  return response.json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request;
  const { title } = request.body;

  const user = users.find(user => user.username === username);

  const userTodo = user.todos.find(todo => todo.id === id);

  userTodo.title = title;

  return response.json({todo: todo});
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;