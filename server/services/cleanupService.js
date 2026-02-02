const MessageTracker = require('../models/MessageTracker');
const ActivityLog = require('../models/ActivityLog');

class CleanupService {
    constructor() {
        this.running = false;
    }

    async start() {
        if (this.running) return;
        this.running = true;
        console.log('🧹 Cleanup Service Started');
        
        // Run cleanup every hour
        setInterval(() => this.cleanup(), 60 * 60 * 1000);
        
        // Run initial cleanup
        setTimeout(() => this.cleanup(), 10000);
    }

    async cleanup() {
        try {
            console.log('🧹 Running periodic cleanup...');
            
            // Remove message trackers older than 24 hours (handled by TTL index)
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const deletedTrackers = await MessageTracker.deleteMany({
                processedAt: { $lt: oneDayAgo }
            });
            
            // Remove old activity logs older than 30 days (handled by TTL index)
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const deletedLogs = await ActivityLog.deleteMany({
                timestamp: { $lt: thirtyDaysAgo }
            });
            
            console.log(`🧹 Cleanup complete: ${deletedTrackers.deletedCount} old trackers, ${deletedLogs.deletedCount} old logs removed`);
            
        } catch (err) {
            console.error('❌ Cleanup Error:', err.message);
        }
    }

    stop() {
        this.running = false;
    }
}

module.exports = new CleanupService();