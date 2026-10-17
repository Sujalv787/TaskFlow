import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTasks,
  fetchTask,
  createTask,
  updateTask,
  deleteTask,
  fetchStats,
  setFilters,
  clearFilters,
  clearCurrentTask,
} from '../store/slices/taskSlice';

export const useTasks = () => {
  const dispatch = useDispatch();
  const { tasks, currentTask, stats, pagination, loading, taskLoading, error, filters } =
    useSelector((state) => state.tasks);

  const loadTasks = useCallback(
    (params = {}) => dispatch(fetchTasks({ ...filters, ...params })),
    [dispatch, filters]
  );

  const loadTask = useCallback((id) => dispatch(fetchTask(id)), [dispatch]);

  const addTask = useCallback(
    async (data) => {
      const result = await dispatch(createTask(data));
      return createTask.fulfilled.match(result)
        ? { success: true, task: result.payload }
        : { success: false, error: result.payload };
    },
    [dispatch]
  );

  const editTask = useCallback(
    async (id, data) => {
      const result = await dispatch(updateTask({ id, taskData: data }));
      return updateTask.fulfilled.match(result)
        ? { success: true, task: result.payload }
        : { success: false, error: result.payload };
    },
    [dispatch]
  );

  const removeTask = useCallback(
    async (id) => {
      const result = await dispatch(deleteTask(id));
      return deleteTask.fulfilled.match(result)
        ? { success: true }
        : { success: false, error: result.payload };
    },
    [dispatch]
  );

  const loadStats = useCallback(() => dispatch(fetchStats()), [dispatch]);

  const updateFilters = useCallback(
    (newFilters) => dispatch(setFilters(newFilters)),
    [dispatch]
  );

  const resetFilters = useCallback(() => dispatch(clearFilters()), [dispatch]);

  const resetCurrentTask = useCallback(() => dispatch(clearCurrentTask()), [dispatch]);

  return {
    tasks,
    currentTask,
    stats,
    pagination,
    loading,
    taskLoading,
    error,
    filters,
    loadTasks,
    loadTask,
    addTask,
    editTask,
    removeTask,
    loadStats,
    updateFilters,
    resetFilters,
    resetCurrentTask,
  };
};
