import { useState } from 'react';

export function TaskManager({
  tasks,
  groupId,
  onAddTask,
  onUpdateTask,
  onRemoveTask,
}) {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        assignedTo: groupId,
        status: 'pending',
        completionPercentage: 0,
        createdAt: new Date().toISOString(),
      };
      onAddTask(task);
      setNewTask({ title: '', description: '', dueDate: '' });
      setShowForm(false);
    }
  };

  const tasksByStatus = {
    pending: tasks.filter((t) => t.status === 'pending'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    completed: tasks.filter((t) => t.status === 'completed'),
  };

  const overallCompletion =
    tasks.length > 0
      ? Math.round(
          tasks.reduce((sum, t) => sum + t.completionPercentage, 0) / tasks.length
        )
      : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">📊 Overall Progress</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-primary-600">{overallCompletion}%</span>
            <span className="text-sm text-gray-600">{tasks.length} tasks total</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${overallCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 space-y-4 animate-slide-in">
          <h3 className="font-bold text-gray-900">Create New Task</h3>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Task description (optional)"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="input-field"
            rows={3}
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="input-field"
          />
          <button onClick={handleAddTask} className="btn btn-primary w-full justify-center">
            ✓ Add Task
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['pending', 'in-progress', 'completed'].map((status) => {
          const statusConfig = {
            pending: { title: '📋 To Do', color: 'border-yellow-300 bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700' },
            'in-progress': { title: '⚙️ In Progress', color: 'border-blue-300 bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
            completed: { title: '✅ Done', color: 'border-green-300 bg-green-50', badge: 'bg-green-100 text-green-700' },
          };
          const config = statusConfig[status];
          
          return (
            <div
              key={status}
              className={`rounded-xl border-2 ${config.color} p-6 min-h-96 flex flex-col`}
            >
              <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg">{config.title}</h3>
                <span className={`badge px-3 py-1 rounded-full text-sm font-bold ${config.badge}`}>
                  {tasksByStatus[status].length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {tasksByStatus[status].length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm">No tasks yet</p>
                ) : (
                  tasksByStatus[status].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateStatus={(newStatus) =>
                        onUpdateTask(task.id, { status: newStatus })
                      }
                      onUpdateCompletion={(percentage) =>
                        onUpdateTask(task.id, { completionPercentage: percentage })
                      }
                      onRemove={() => onRemoveTask(task.id)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onUpdateStatus,
  onUpdateCompletion,
  onRemove,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [completion, setCompletion] = useState(task.completionPercentage.toString());

  const handleSaveCompletion = () => {
    const percentage = Math.min(100, Math.max(0, parseInt(completion) || 0));
    onUpdateCompletion(percentage);
    if (percentage === 100) {
      onUpdateStatus('completed');
    }
    setIsEditing(false);
  };

  const handleNextStatus = () => {
    if (task.status === 'pending') {
      onUpdateStatus('in-progress');
    } else if (task.status === 'in-progress') {
      onUpdateStatus('completed');
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-900 line-clamp-2">{task.title}</h4>
        <button
          onClick={onRemove}
          className="btn btn-sm bg-red-100 text-red-600 hover:bg-red-200 flex-shrink-0 ml-2"
        >
          ✕
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="text-xs text-gray-500 mb-3">
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <div className="mb-3">
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={completion}
              onChange={(e) => setCompletion(e.target.value)}
              min="0"
              max="100"
              className="w-16 px-2 py-1 border-2 border-gray-300 rounded text-sm"
            />
            <span className="text-sm font-bold text-gray-700">%</span>
            <button
              onClick={handleSaveCompletion}
              className="btn btn-sm btn-primary"
            >
              ✓
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-1">
              <button
                onClick={() => setIsEditing(true)}
                className="font-bold text-primary-600 hover:text-primary-700 text-sm"
              >
                {task.completionPercentage}%
              </button>
            </div>
            <div className="progress-bar h-2">
              <div
                className="progress-fill"
                style={{ width: `${task.completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleNextStatus}
        className={`w-full btn btn-sm text-center justify-center ${
          task.status === 'completed'
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : task.status === 'in-progress'
            ? 'btn-gold'
            : 'btn-primary'
        }`}
        disabled={task.status === 'completed'}
      >
        {task.status === 'pending' && '▶️ Start'}
        {task.status === 'in-progress' && '⏸️ Mark Done'}
        {task.status === 'completed' && '✅ Completed'}
      </button>
    </div>
  );
}

export default TaskManager;
