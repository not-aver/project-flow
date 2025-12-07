require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });

const app = require('./app');
const { sequelize } = require('./models');
const { DataTypes } = require('sequelize');

const syncDatabase = async () => {
  await sequelize.sync();

  const qi = sequelize.getQueryInterface();
  try {
    const desc = await qi.describeTable('tasks');
    const ensure = async (name, spec) => {
      if (!desc[name]) {
        console.log(`Adding missing column tasks.${name} ...`);
        await qi.addColumn('tasks', name, spec);
      }
    };
    await ensure('position', { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 });
    await ensure('status', { type: DataTypes.STRING, allowNull: false, defaultValue: 'TODO' });
  } catch (e) {
  }
};

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    console.log('Syncing database models...');
    await syncDatabase();
    console.log('Database models synced.');
    
    app.listen(PORT, () => {
      console.log(`API is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.parent) {
      console.error('Database error:', error.parent.message);
    }
    console.error('Full error:', error);
    process.exit(1);
  }
};

start();

