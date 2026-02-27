const cron = require('node-cron');
const Event = require('../models/event');
const sendMail = require('../controlers/sendMail');

// Check for upcoming events and send reminders
const checkReminders = async () => {
    try {
        console.log('[Cron] Checking for event reminders...');
        const now = new Date();

        // Find events that:
        // - have reminders enabled
        // - haven't sent a reminder yet
        // - are not cancelled
        // - eventDate is in the future
        const events = await Event.find({
            'reminder.enabled': true,
            'reminder.sent': false,
            status: { $ne: 'cancelled' },
            eventDate: { $gte: now }
        }).populate('quoteId', 'customer.recipient');

        let sentCount = 0;

        for (const event of events) {
            // Need to calculate if (eventDate - sendBeforeHours) is <= now
            // But we must consider eventTime as well for accurate comparison

            // Construct full Date object for the event start time
            const eventDateTime = new Date(event.eventDate);
            if (event.eventTime) {
                const [hours, minutes] = event.eventTime.split(':');
                eventDateTime.setHours(parseInt(hours, 10));
                eventDateTime.setMinutes(parseInt(minutes, 10));
            }

            const sendBeforeMs = event.reminder.sendBeforeHours * 60 * 60 * 1000;
            const reminderTime = new Date(eventDateTime.getTime() - sendBeforeMs);

            // If it's time to send the reminder
            if (now >= reminderTime && now < eventDateTime) {
                // Prepare email contents
                const subject = `Reminder: Upcoming Event - ${event.activityType}`;

                // Format date nicely
                const formattedDate = eventDateTime.toLocaleDateString();
                const formattedTime = event.eventTime || 'Not specified';

                const htmlBody = `
                    <h2>Event Reminder</h2>
                    <p>Hello ${event.customer.contactPerson || event.customer.recipient || 'Customer'},</p>
                    <p>This is a reminder for your upcoming event:</p>
                    <ul>
                        <li><strong>Activity:</strong> ${event.activityType}</li>
                        <li><strong>Date:</strong> ${formattedDate}</li>
                        <li><strong>Time:</strong> ${formattedTime}</li>
                        <li><strong>Location:</strong> ${event.address || 'Not specified'}</li>
                    </ul>
                    <p>Looking forward to seeing you!</p>
                `;

                // If event has no email, we can't send it, but we could warn
                if (!event.customer.email) {
                    console.log(`[Cron] Event ${event._id} has no email address. Skipping email.`);
                    continue;
                }

                // Send email
                await sendMail(subject, 'Reminder for your event.', htmlBody, event.customer.email);

                // Update event record to indicate reminder was sent
                event.reminder.sent = true;
                await event.save();
                sentCount++;
                console.log(`[Cron] Reminder sent for event ${event._id} to ${event.customer.email}`);
            }
        }

        if (sentCount > 0) {
            console.log(`[Cron] Sent ${sentCount} reminders.`);
        }

    } catch (error) {
        console.error('[Cron] Error running reminder check:', error);
    }
};

// Schedule it to run every 15 minutes
const startReminderCron = () => {
    // 0,15,30,45 * * * * = run every 15 minutes
    cron.schedule('*/15 * * * *', checkReminders, {
        scheduled: true,
        timezone: "Asia/Jerusalem" // A reasonable default, or could be omitted to rely on server timezone
    });
    console.log('[Cron] Reminder service scheduled to run every 15 minutes.');
};

module.exports = { startReminderCron, checkReminders };
