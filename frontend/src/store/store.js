import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../modules/auth/authSlice';
import projectReducer from '../modules/projects/projectSlice';
import taskReducer from '../modules/tasks/taskSlice';

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    projects: projectReducer,
    tasks:    taskReducer,
  },
});
