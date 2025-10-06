import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState('');

  // Fetch todos from Firebase on load
  useEffect(() => {
    const fetchTodos = async () => {
      const todosCollection = collection(db, 'todos');
      const todoSnapshot = await getDocs(todosCollection);
      const todoList = todoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTodos(todoList);
    };
    fetchTodos();
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (input.trim() === '') return;
    await addDoc(collection(db, 'todos'), { text: input, completed: false });
    setInput('');
    // Refresh list
    const todoSnapshot = await getDocs(collection(db, 'todos'));
    setTodos(todoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Toggle complete
  const toggleComplete = async (id, completed) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, { completed: !completed });
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !completed } : todo));
  };

  // Start editing
  const startEdit = (id, text) => {
    setEditId(id);
    setEditInput(text);
  };

  // Save edit
  const saveEdit = async () => {
    if (editInput.trim() === '') return;
    const todoDoc = doc(db, 'todos', editId);
    await updateDoc(todoDoc, { text: editInput });
    setTodos(todos.map(todo => todo.id === editId ? { ...todo, text: editInput } : todo));
    setEditId(null);
    setEditInput('');
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h1>Todo List</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
            {editId === todo.id ? (
              <>
                <input
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id, todo.completed)}
                />
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', marginLeft: '10px' }}>
                  {todo.text}
                </span>
                <button onClick={() => startEdit(todo.id, todo.text)} style={{ marginLeft: '10px' }}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '10px' }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;