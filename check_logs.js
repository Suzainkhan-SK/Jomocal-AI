const mongoose = require('mongoose');
const ActivityLog = require('./server/models/ActivityLog');
require('dotenv').config({ path: './server/.env' });

async function checkLogs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(5);
        console.log('Recent Logs:', JSON.stringify(logs, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkLogs();
