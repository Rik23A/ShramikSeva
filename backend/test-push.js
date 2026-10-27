
const mongoose = require('mongoose');
const NotificationService = require('./services/notificationService');
const { User } = require('./models/User');
require('dotenv').config();

async function testPush() {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Find a user with either pushToken or pushTokens
        const user = await User.findOne({
            $or: [
                { pushToken: { $exists: true, $ne: null } },
                { 'pushTokens.0': { $exists: true } }
            ]
        }).select('+pushTokens +pushToken');
        
        if (!user) {
            console.log('⚠️ No user found with registered push tokens. Please log into the app on a device.');
            return;
        }

        console.log(`👤 Found user: ${user.name} (${user._id})`);
        console.log(`📱 Devices:`, user.pushTokens?.length ? user.pushTokens : user.pushToken);

        const notificationData = {
            userId: user._id,
            userRole: user.role,
            type: 'new_message',
            title: 'Diagnostic Test Message 💬',
            message: 'Your push notification system is operating at full industry standard.',
            relatedId: new mongoose.Types.ObjectId(),
            relatedModel: 'Conversation',
            actionUrl: '/messages'
        };

        console.log('🚀 Dispatching push notification via NotificationService...');
        await NotificationService.sendPushNotification(user._id, notificationData);
        console.log('✅ Push notification test completed.');

    } catch (error) {
        console.error('❌ Error in testPush:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testPush();
