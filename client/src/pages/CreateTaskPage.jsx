import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTasks } from '../hooks/useTasks';
import TaskForm from '../components/tasks/TaskForm';
import { fetchUsers } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addTask, taskLoading } = useTasks();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = useCallback(async (data) => {
    const result = await addTask(data);
    if (result.success) {
      toast.success('Task created successfully! 🎉');
      navigate('/tasks');
    } else {
      toast.error(result.error || 'Failed to create task');
    }
  }, [addTask, navigate]);

  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Create New Task</h2>
        <p className="text-secondary text-sm">Fill in the details to create a new task</p>
      </div>
      <div className="card" style={{ padding: 28 }}>
        <TaskForm onSubmit={handleSubmit} loading={taskLoading} submitLabel="Create Task" />
      </div>
    </div>
  );
};

export default CreateTaskPage;
