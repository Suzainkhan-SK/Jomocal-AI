const { default: mongoose } = await import('mongoose');
await import('dotenv/config');

async function fixDuplicateIntegrations() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
        
        const Integration = (await import('./server/models/Integration.js')).default;
        
        // Find all Telegram integrations
        const telegramIntegrations = await Integration.find({ platform: 'telegram' });
        console.log(`Found ${telegramIntegrations.length} Telegram integrations`);
        
        // Group by token
        const tokenGroups = {};
        telegramIntegrations.forEach(integration => {
            const token = integration.credentials?.token;
            if (token) {
                if (!tokenGroups[token]) {
                    tokenGroups[token] = [];
                }
                tokenGroups[token].push({
                    id: integration._id,
                    userId: integration.userId,
                    createdAt: integration.createdAt
                });
            }
        });
        
        // Find duplicates
        const duplicates = Object.entries(tokenGroups).filter(([token, integrations]) => integrations.length > 1);
        
        console.log(`\nFound ${duplicates.length} duplicate tokens:`);
        
        for (const [token, integrations] of duplicates) {
            console.log(`\nToken: ${token.substring(0, 15)}...`);
            
            // Sort by creation date, keep the oldest, remove newer ones
            integrations.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            
            console.log('  Integrations:');
            integrations.forEach((int, index) => {
                console.log(`    ${index + 1}. User: ${int.userId} | Created: ${int.createdAt} | ID: ${int.id} ${index === 0 ? '(KEEP)' : '(REMOVE)'}`);
            });
            
            // Remove all except the first (oldest) one
            const idsToRemove = integrations.slice(1).map(int => int.id);
            if (idsToRemove.length > 0) {
                console.log(`  Removing ${idsToRemove.length} duplicate integrations...`);
                await Integration.deleteMany({ _id: { $in: idsToRemove } });
                console.log('  ✓ Removed successfully');
            }
        }
        
        console.log('\n✅ Duplicate integration cleanup completed!');
        
        // Verify cleanup
        const remainingIntegrations = await Integration.find({ platform: 'telegram' });
        const remainingTokens = [...new Set(remainingIntegrations.map(int => int.credentials?.token).filter(Boolean))];
        console.log(`\nRemaining unique Telegram tokens: ${remainingTokens.length}`);
        
        mongoose.connection.close();
        
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixDuplicateIntegrations();