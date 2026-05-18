require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/config/db');
// Load model associations (must be before sync)
require('./src/config/associations');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Sync all Sequelize models to SQLite (creates tables if they don't exist)
    await sequelize.sync();
    console.log(' Database synced successfully');

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
