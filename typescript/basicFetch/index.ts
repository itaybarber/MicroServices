import axios from 'axios';

console.log('Hello world');

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const url = "http://jsonplaceholder.typicode.com/todos/1";

axios.get(url).then(response => {
  const todo = response.data as Todo;
  const id = todo.id;
  const title = todo.title;
  const completed = todo.completed;

  logTodo(id, title, completed);
});

const logTodo = (id: number, title: string, completed: boolean) => {
  console.log(`
  The Todo of id: ${id}
  Has a title of: ${title}
  Is it finished? ${completed}
  `);

}