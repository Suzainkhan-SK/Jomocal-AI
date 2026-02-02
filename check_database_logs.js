const { default: mongoose } = await import('mongoose');
await import('dotenv/config');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        
        // Import the ActivityLog model
        const ActivityLog = require('./server/models/ActivityLog');
        
        // Get all logs
        const logs = await ActivityLog.find({}).sort({ timestamp: -1 }).limit(10);
        
        console.log(`\nFound ${logs.length} logs:`);
        logs.forEach((log, index) => {
            console.log(`\n--- Log ${index + 1} ---`);
            console.log(`ID: ${log._id}`);
            console.log(`User ID: ${log.userId}`);
            console.log(`Automation: ${log.automationName}`);
            console.log(`Action: ${log.action}`);
            console.log(`Status: ${log.status}`);
            console.log(`Timestamp: ${log.timestamp}`);
            console.log(`Platform: ${log.platform}`);
        });
        
        mongoose.connection.close();
    })
    .catch(err => {
        console.log('MongoDB Connection Error:', err);
        process.exit(1);
    });