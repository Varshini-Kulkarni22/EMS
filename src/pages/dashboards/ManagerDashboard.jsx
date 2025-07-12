import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuid } from 'uuid';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [employees, setEmployees] = useState([]);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', password: '' });
  const [employeeTasks, setEmployeeTasks] = useState({});
  const [taskInputs, setTaskInputs] = useState({});
  const [columns, setColumns] = useState({
    todo: { name: 'To Do', items: [] },
    inprogress: { name: 'In Progress', items: [] },
    done: { name: 'Done', items: [] },
  });
  const [adminTasks, setAdminTasks] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const filtered = users.filter(u => u.role === 'employee' && u.manager === currentUser.email);
    setEmployees(filtered);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const kanbanData = JSON.parse(localStorage.getItem(`kanban_${currentUser.email}`));
      if (kanbanData) {
        setColumns(kanbanData);
        const flatTasks = Object.values(kanbanData).flatMap(col => col.items);
        const updatedTasks = flatTasks.map((task) => {
          let progress = 0;
          if (kanbanData.inprogress.items.find(t => t.id === task.id)) progress = 50;
          if (kanbanData.done.items.find(t => t.id === task.id)) progress = 100;
          return { ...task, progress };
        });
        setAdminTasks(updatedTasks);
        const managerTasks = JSON.parse(localStorage.getItem('managerTasks')) || {};
        managerTasks[currentUser.email] = updatedTasks;
        localStorage.setItem('managerTasks', JSON.stringify(managerTasks));
      }

      const empTaskData = JSON.parse(localStorage.getItem(`empTasks_${currentUser.email}`)) || {};
      setEmployeeTasks(empTaskData);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceItems = [...columns[source.droppableId].items];
    const destItems = [...columns[destination.droppableId].items];
    const [movedItem] = sourceItems.splice(source.index, 1);
    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
    } else {
      destItems.splice(destination.index, 0, movedItem);
    }
    const updated = {
      ...columns,
      [source.droppableId]: { ...columns[source.droppableId], items: sourceItems },
      [destination.droppableId]: { ...columns[destination.droppableId], items: destItems },
    };
    setColumns(updated);
    localStorage.setItem(`kanban_${currentUser.email}`, JSON.stringify(updated));
  };

  const handleTaskInputChange = (email, field, value) => {
    setTaskInputs((prev) => ({
      ...prev,
      [email]: { ...prev[email], [field]: value },
    }));
  };

  const assignTaskToEmployee = (email) => {
    const input = taskInputs[email];
    if (!input || !input.task) return alert('Task name required');
    const newTask = {
      id: uuid(),
      task: input.task,
      dueDate: input.dueDate || '',
      priority: input.priority || 'Medium',
      file: input.file || '',
      comment: input.comment || '',
      status: 'Not Started'
    };
    const tasks = { ...employeeTasks };
    if (!Array.isArray(tasks[email])) tasks[email] = [];
    tasks[email].push(newTask);
    setEmployeeTasks(tasks);
    localStorage.setItem(`empTasks_${currentUser.email}`, JSON.stringify(tasks));
    setTaskInputs({ ...taskInputs, [email]: {} });
  };

  const removeTaskFromEmployee = (email, id) => {
    const tasks = { ...employeeTasks };
    tasks[email] = tasks[email].filter((t) => t.id !== id);
    setEmployeeTasks(tasks);
    localStorage.setItem(`empTasks_${currentUser.email}`, JSON.stringify(tasks));
  };

  const addEmployee = () => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const exists = allUsers.find((u) => u.email === newEmp.email);
    if (exists) return alert('Email already exists');

    const emp = {
      ...newEmp,
      role: 'employee',
      manager: currentUser.email,
    };

    const updated = [...allUsers, emp];
    localStorage.setItem('users', JSON.stringify(updated));
    setEmployees([...employees, emp]);
    setNewEmp({ name: '', email: '', password: '' });
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const theme = localStorage.getItem(`theme_${currentUser.email}`) || 'light';

  return (
    <div className={`p-6 min-h-screen transition-all ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/reports" className="text-blue-600 hover:underline dark:text-blue-400">📊 Reports</Link>
          <Link to="/settings" className="text-blue-600 hover:underline dark:text-blue-400">⚙️ Settings</Link>
        </div>
      </div>

      <div className="mb-6 p-4 rounded shadow bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold">Tasks from Admin</h2>
        {adminTasks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No tasks assigned yet.</p>
        ) : (
          <ul className="list-disc ml-6">
            {adminTasks.map((t, idx) => (
              <li key={idx}>{t.task} - {t.progress}%</li>
            ))}
          </ul>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(columns).map(([colId, col]) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-4 rounded shadow bg-white dark:bg-gray-800 min-h-[300px]"
                >
                  <h2 className="text-xl font-semibold mb-4">{col.name}</h2>
                  {col.items.map((task, idx) => (
                    <Draggable key={task.id} draggableId={task.id} index={idx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-100 dark:bg-gray-700 p-3 mb-3 rounded border border-gray-300 dark:border-gray-600"
                        >
                          <p className="font-semibold">{task.task}</p>
                          {task.comment && <p className="text-sm italic text-gray-600 dark:text-gray-300">💬 {task.comment}</p>}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <div className="mt-10 p-4 rounded shadow bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input placeholder="Name" className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" value={newEmp.name} onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })} />
          <input placeholder="Email" className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" value={newEmp.email} onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })} />
          <input placeholder="Password" className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" value={newEmp.password} onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })} />
        </div>
        <button onClick={addEmployee} className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">Add</button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Employees</h2>
        {employees.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No employees added yet.</p>
        ) : (
          employees.map((emp) => (
            <div key={emp.email} className="p-4 rounded shadow bg-white dark:bg-gray-800 my-4">
              <p><strong>Name:</strong> {emp.name}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <input placeholder="Task" className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" value={taskInputs[emp.email]?.task || ''} onChange={(e) => handleTaskInputChange(emp.email, 'task', e.target.value)} />
                <input type="date"  placeholder="Deadline" className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" value={taskInputs[emp.email]?.dueDate || ''} onChange={(e) => handleTaskInputChange(emp.email, 'dueDate', e.target.value)} />
                <select className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" value={taskInputs[emp.email]?.priority || 'Medium'} onChange={(e) => handleTaskInputChange(emp.email, 'priority', e.target.value)}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <input placeholder="Comment" className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" value={taskInputs[emp.email]?.comment || ''} onChange={(e) => handleTaskInputChange(emp.email, 'comment', e.target.value)} />
              </div>
              <button onClick={() => assignTaskToEmployee(emp.email)} className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">Assign Task</button>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Assigned Tasks:</h4>
                <ul className="list-disc pl-4">
                  {(employeeTasks[emp.email] || []).map((task) => (
                    <li key={task.id} className="flex justify-between items-start py-1">
                      <div>
                        <span className="font-medium">{task.task}</span><br />
                        <span className="text-sm text-gray-700 dark:text-gray-300">📅 {task.dueDate || 'N/A'} | ⚠️ {task.priority}</span><br />
                        {task.comment && <span className="text-sm italic text-gray-600 dark:text-gray-300">💬 {task.comment}</span>}
                      </div>
                      <button onClick={() => removeTaskFromEmployee(emp.email, task.id)} className="text-red-500 ml-2">✕</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
