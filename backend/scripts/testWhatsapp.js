/**
 * WhatsApp Meta Cloud API Diagnostic & Test Script
 * 
 * Usage:
 *   1. Check configuration status:
 *      node scripts/testWhatsapp.js --check
 * 
 *   2. Send test template message:
 *      node scripts/testWhatsapp.js <phone_number> template
 * 
 *   3. Send test direct text message (valid within 24h user window):
 *      node scripts/testWhatsapp.js <phone_number> text "Your custom message"
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const whatsappService = require('../services/whatsappService');

const args = process.argv.slice(2);

console.log('====================================================');
console.log('     Shramik Seva - WhatsApp API Diagnostic Tool    ');
console.log('====================================================\n');

const checkStatus = () => {
    console.log('📋 Checking WhatsApp Environment Configuration:');
    console.log('----------------------------------------------------');
    console.log(`• WHATSAPP_API_VERSION      : ${process.env.WHATSAPP_API_VERSION || 'v19.0 (Default)'}`);
    console.log(`• WHATSAPP_PHONE_NUMBER_ID  : ${process.env.WHATSAPP_PHONE_NUMBER_ID ? '✅ Configured (' + process.env.WHATSAPP_PHONE_NUMBER_ID + ')' : '❌ Missing'}`);
    console.log(`• WHATSAPP_ACCESS_TOKEN     : ${process.env.WHATSAPP_ACCESS_TOKEN ? '✅ Configured (' + process.env.WHATSAPP_ACCESS_TOKEN.substring(0, 15) + '...)' : '❌ Missing'}`);
    console.log(`• Template (Job Suggestion) : ${process.env.WHATSAPP_TEMPLATE_JOB_SUGGESTION || 'job_suggestion (Default)'}`);
    console.log(`• Template (Worker Match)   : ${process.env.WHATSAPP_TEMPLATE_WORKER_SUGGESTION || 'worker_suggestion (Default)'}`);
    console.log(`• Template (Application)    : ${process.env.WHATSAPP_TEMPLATE_NEW_APPLICATION || 'new_application (Default)'}`);
    console.log(`• Template (Worker Hired)   : ${process.env.WHATSAPP_TEMPLATE_WORKER_HIRED || 'worker_hired (Default)'}`);
    console.log(`• Template (Announcement)   : ${process.env.WHATSAPP_TEMPLATE_ADMIN_ANNOUNCEMENT || 'admin_announcement (Default)'}`);
    console.log('----------------------------------------------------');

    const configured = whatsappService.isConfigured();
    if (configured) {
        console.log('\n🟢 STATUS: WhatsApp Service is CONFIGURED and ready to send messages.');
        console.log('   To send a live test message, run:');
        console.log('   node scripts/testWhatsapp.js <recipient_phone_number>');
    } else {
        console.log('\n🟡 STATUS: WhatsApp Service is NOT YET CONFIGURED.');
        console.log('   In-app notifications and Mobile Push Notifications are operating normally.');
        console.log('   To activate WhatsApp, add WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN to backend/.env');
    }
};

const runTest = async () => {
    if (args.length === 0 || args[0] === '--check') {
        checkStatus();
        return;
    }

    const recipient = args[0];
    const mode = args[1] || 'template';
    const customText = args[2] || 'Test notification from Shramik Seva diagnostic tool.';

    checkStatus();

    if (!whatsappService.isConfigured()) {
        console.log('\n❌ Cannot send test message: Credentials missing in .env');
        process.exit(1);
    }

    console.log(`\n🚀 Attempting to send test message to: ${recipient}`);
    console.log(`• Mode: ${mode.toUpperCase()}`);

    try {
        let result;
        if (mode === 'text') {
            console.log(`• Sending direct text: "${customText}"`);
            result = await whatsappService.sendMessage(recipient, customText);
        } else {
            console.log('• Sending job suggestion template test...');
            result = await whatsappService.sendJobSuggestion(recipient, {
                workerName: 'Test Worker',
                jobTitle: 'Electrician',
                employerName: 'Shramik Seva Test Org'
            });
        }

        if (result?.success) {
            console.log('\n🎉 SUCCESS! WhatsApp message sent successfully.');
            console.log(`   Message ID: ${result.messageId || 'ok'}`);
        } else {
            console.log('\n❌ FAILED to send WhatsApp message.');
            console.log('   Details:', JSON.stringify(result?.error || result?.reason, null, 2));
        }
    } catch (err) {
        console.error('\n💥 Unexpected error during test execution:', err);
    }
};

runTest();
