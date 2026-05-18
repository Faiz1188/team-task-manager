import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/projects');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects');
  }
});

export const fetchProject = createAsyncThunk('projects/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/projects/${id}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch project');
  }
});

export const createProject = createAsyncThunk('projects/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/projects', payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create project');
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/projects/${id}`, payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update project');
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete project');
  }
});

export const addMember = createAsyncThunk('projects/addMember', async ({ projectId, userId }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/projects/${projectId}/members`, { userId });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add member');
  }
});

export const removeMember = createAsyncThunk('projects/removeMember', async ({ projectId, uid }, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/projects/${projectId}/members/${uid}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove member');
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearProjectError(state) { state.error = null; },
    clearCurrentProject(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending,  (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProjects.fulfilled,(s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchProject.pending,   (s) => { s.loading = true; })
      .addCase(fetchProject.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchProject.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createProject.fulfilled,(s, a) => { s.list.unshift(a.payload); })
      .addCase(updateProject.fulfilled,(s, a) => {
        const idx = s.list.findIndex((p) => p.id === a.payload.id);
        if (idx !== -1) s.list[idx] = a.payload;
        s.current = a.payload;
      })
      .addCase(deleteProject.fulfilled,(s, a) => { s.list = s.list.filter((p) => p.id !== a.payload); })
      .addCase(addMember.fulfilled,    (s, a) => { s.current = a.payload; })
      .addCase(removeMember.fulfilled, (s, a) => { s.current = a.payload; });
  },
});

export const { clearProjectError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
