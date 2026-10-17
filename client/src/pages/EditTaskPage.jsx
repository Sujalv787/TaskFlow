import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTasks } from '../hooks/useTasks';
import TaskForm from '../components/tasks/TaskForm';
import { fetchUsers } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTask, taskLoading, editTask, loadTask } = useTasks();

  useEffect(() => {
    loadTask(id);
    dispatch(fetchUsers());
  }, [id, dispatch, loadTask]);

  const handleSubmit = useCallback(async (data) => {
    const result = await editTask(id, data);
    if (result.success) {
      toast.success('Task updated successfully!');
      navigate(`/tasks/${id}`);
    } else {
      toast.error(result.error || 'Failed to update task');
    }
  }, [editTask, id, navigate]);

  if (taskLoading && !currentTask) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 300 }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Edit Task</h2>
        <p className="text-secondary text-sm">Update the task details below</p>
      </div>
      <div className="card" style={{ padding: 28 }}>
        {currentTask && (
          <TaskForm
            key={currentTask._id}
            initialValues={currentTask}
            onSubmit={handleSubmit}
            loading={taskLoading}
            submitLabel="Update Task"
          />
        )}
      </div>
    </div>
  );
};

export default EditTaskPage;
