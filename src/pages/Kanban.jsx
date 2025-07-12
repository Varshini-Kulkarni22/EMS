// File: src/pages/Kanban.jsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuid } from 'uuid';

const columnsFromBackend = {
  todo: {
    name: 'To Do',
    items: [],
  },
  inprogress: {
    name: 'In Progress',
    items: [],
  },
  done: {
    name: 'Done',
    items: [],
  },
};

const Kanban = () => {
  const [columns, setColumns] = useState(columnsFromBackend);
  const [taskContent, setTaskContent] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskComment, setTaskComment] = useState('');

  const handleAddTask = () => {
    if (!taskContent.trim()) return;
    const newTask = {
      id: uuid(),
      content: taskContent,
      priority: taskPriority,
      comment: taskComment,
    };
    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        items: [...prev.todo.items, newTask],
      },
    }));
    setTaskContent('');
    setTaskPriority('Medium');
    setTaskComment('');
  };

  const handleDeleteTask = (columnId, taskId) => {
    const updatedItems = columns[columnId].items.filter(task => task.id !== taskId);
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: updatedItems,
      },
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceItems = [...columns[source.droppableId].items];
    const destItems = [...columns[destination.droppableId].items];
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...columns[source.droppableId],
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...columns[source.droppableId],
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...columns[destination.droppableId],
          items: destItems,
        },
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Task Management Board</h1>

      {/* Task Input Form */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Task description"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="text"
          placeholder="Optional comment"
          value={taskComment}
          onChange={(e) => setTaskComment(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      {/* Kanban Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(columns).map(([columnId, column], index) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white p-4 rounded shadow min-h-[400px]"
                >
                  <h2 className="text-xl font-semibold mb-4">{column.name}</h2>
                  {column.items.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-50 p-3 mb-3 rounded border shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{task.content}</p>
                            <button
                              onClick={() => handleDeleteTask(columnId, task.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Priority: {task.priority}</p>
                          {task.comment && (
                            <p className="text-sm italic text-gray-400 mt-1">💬 {task.comment}</p>
                          )}
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
    </div>
  );
};

export default Kanban;
