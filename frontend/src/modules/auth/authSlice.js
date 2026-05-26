import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const savedUser  = JSON.parse(localStorage.getItem('user')  || 'null');
const savedToken = localStorage.getItem('token') || null;

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/signup', payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    savedUser,
    token:   savedToken,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const handlePending  = (state) => { state.loading = true;  state.error = null; };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.user    = action.payload.user;
      state.token   = action.payload.token;
      localStorage.setItem('user',  JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    };
    builder
      .addCase(loginUser.pending,   handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected,  handleRejected)
      .addCase(signupUser.pending,   handlePending)
      .addCase(signupUser.fulfilled, handleFulfilled)
      .addCase(signupUser.rejected,  handleRejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
