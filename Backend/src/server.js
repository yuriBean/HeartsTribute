import app from './app.js';
import scheduleCronJobs from './cronJobs.js';

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
  scheduleCronJobs(); // Start the cron jobs when the server starts
});
