import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/task.service';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await taskService.getTasks(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await taskService.getTask(id);
      return data.task;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const { data } = await taskService.createTask(taskData);
      return data.task;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const { data } = await taskService.updateTask(id, taskData);
      return data.task;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'tasks/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await taskService.getStats();
      return data.stats;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    currentTask: null,
    stats: { total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0, priority: {} },
    pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    loading: false,
    taskLoading: false,
    error: null,
    filters: {
      search: '',
      status: '',
      priority: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: '', status: '', priority: '', sortBy: 'createdAt', sortOrder: 'desc' };
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
        if (action.payload.stats) state.stats = action.payload.stats;
      })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // Fetch Single Task
    builder
      .addCase(fetchTask.pending, (state) => { state.taskLoading = true; })
      .addCase(fetchTask.fulfilled, (state, action) => { state.taskLoading = false; state.currentTask = action.payload; })
      .addCase(fetchTask.rejected, (state, action) => { state.taskLoading = false; state.error = action.payload; });

    // Create Task
    builder
      .addCase(createTask.pending, (state) => { state.taskLoading = true; state.error = null; })
      .addCase(createTask.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.tasks.unshift(action.payload);
        state.stats.total += 1;
        state.stats[action.payload.status === 'in-progress' ? 'inProgress' : action.payload.status] += 1;
      })
      .addCase(createTask.rejected, (state, action) => { state.taskLoading = false; state.error = action.payload; });

    // Update Task
    builder
      .addCase(updateTask.pending, (state) => { state.taskLoading = true; state.error = null; })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.taskLoading = false;
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
        if (state.currentTask?._id === action.payload._id) state.currentTask = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => { state.taskLoading = false; state.error = action.payload; });

    // Delete Task
    builder
      .addCase(deleteTask.pending, (state) => { state.taskLoading = true; })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.taskLoading = false;
        const task = state.tasks.find((t) => t._id === action.payload);
        if (task) {
          state.stats.total = Math.max(0, state.stats.total - 1);
        }
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => { state.taskLoading = false; state.error = action.payload; });

    // Fetch Stats
    builder.addCase(fetchStats.fulfilled, (state, action) => { state.stats = action.payload; });
  },
});

export const { setFilters, clearFilters, clearCurrentTask, clearError } = taskSlice.actions;
export default taskSlice.reducer;
