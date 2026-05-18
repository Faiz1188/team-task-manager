const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const projectRoutes = require('./modules/projects/project.routes');
const taskRoutes = require('./modules/tasks/task.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

//  Core Middleware 
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

//  Routes 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

//  Health Check 
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Team Task Manager API is running' });
});

//  Global Error Handler 
app.use(errorMiddleware);

module.exports = app;
