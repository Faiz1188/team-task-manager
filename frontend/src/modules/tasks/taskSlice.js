import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/tasks', { params });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const fetchDashboard = createAsyncThunk('tasks/dashboard', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/tasks/dashboard');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard');
  }
});

export const createTask = createAsyncThunk('tasks/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/tasks', payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/tasks/${id}`, payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update task');
  }
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/tasks/${id}/status`, { status });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], dashboard: null, loading: false, error: null, filters: {} },
  reducers: {
    setFilters(state, action) { state.filters = action.payload; },
    clearTaskError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending,        (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTasks.fulfilled,      (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchTasks.rejected,       (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchDashboard.fulfilled,  (s, a) => { s.dashboard = a.payload; })
      .addCase(createTask.fulfilled,      (s, a) => { s.list.unshift(a.payload); })
      .addCase(updateTask.fulfilled,      (s, a) => {
        const idx = s.list.findIndex((t) => t.id === a.payload.id);
        if (idx !== -1) s.list[idx] = a.payload;
      })
      .addCase(updateTaskStatus.fulfilled,(s, a) => {
        const idx = s.list.findIndex((t) => t.id === a.payload.id);
        if (idx !== -1) s.list[idx] = a.payload;
      })
      .addCase(deleteTask.fulfilled,      (s, a) => { s.list = s.list.filter((t) => t.id !== a.payload); });
  },
});

export const { setFilters, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
