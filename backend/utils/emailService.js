/**
 * Email Service Utility
 * Handles sending emails for various notifications
 */

// Simple console-based email service (for development)
// For production, integrate with SendGrid, AWS SES, or Nodemailer

const sendEmail = async ({ to, subject, html }) => {
  try {
    // In development, just log the email
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:');
      console.log('  To:', to);
      console.log('  Subject:', subject);
      console.log('  Body:', html.substring(0, 100) + '...');
      return { success: true, message: 'Email logged in development mode' };
    }

    // Production: Integrate with your email service
    // Example with Nodemailer:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({ from, to, subject, html });

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Email Templates
const emailTemplates = {
  bookingConfirmation: (booking) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #16a34a, #2563eb); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Booking Confirmed! 🎉</h1>
      </div>
      <div style="padding: 40px; background: white;">
        <h2 style="color: #1f2937;">Thank you for your booking!</h2>
        <p style="color: #4b5563; font-size: 16px;">Dear ${booking.contactInfo.name},</p>
        <p style="color: #4b5563;">Your booking for <strong>${booking.title}</strong> has been confirmed.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Booking Details:</h3>
          <p style="margin: 8px 0;"><strong>Destination:</strong> ${booking.destinationName}</p>
          <p style="margin: 8px 0;"><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
          <p style="margin: 8px 0;"><strong>Guests:</strong> ${booking.guests}</p>
          <p style="margin: 8px 0;"><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
          <p style="margin: 8px 0;"><strong>Booking ID:</strong> ${booking._id}</p>
        </div>

        <p style="color: #4b5563;">We'll send you a reminder before your trip. If you have any questions, feel free to contact us.</p>
        
        <p style="color: #4b5563; margin-top: 30px;">Best regards,<br><strong>Bihar Tourism Team</strong></p>
      </div>
      <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `,

  bookingReminder: (booking) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Trip Reminder! 🧳</h1>
      </div>
      <div style="padding: 40px; background: white;">
        <h2 style="color: #1f2937;">Your trip is coming up!</h2>
        <p style="color: #4b5563; font-size: 16px;">Hi ${booking.contactInfo.name},</p>
        <p style="color: #4b5563;">Just a friendly reminder that your trip to <strong>${booking.title}</strong> is scheduled for <strong>${new Date(booking.startDate).toLocaleDateString()}</strong>.</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #92400e;">Quick Checklist:</h3>
          <ul style="color: #78350f;">
            <li>✓ Pack your bags</li>
            <li>✓ Check weather forecast</li>
            <li>✓ Carry ID proof</li>
            <li>✓ Save emergency contacts</li>
          </ul>
        </div>

        <p style="color: #4b5563;">We wish you a wonderful trip! 🌟</p>
        
        <p style="color: #4b5563; margin-top: 30px;">Warm regards,<br><strong>Bihar Tourism Team</strong></p>
      </div>
    </div>
  `,

  festivalReminder: (festival) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Festival Alert! 🎊</h1>
      </div>
      <div style="padding: 40px; background: white;">
        <h2 style="color: #1f2937;">${festival.name} is approaching!</h2>
        <p style="color: #4b5563; font-size: 16px;">Don't miss out on this amazing celebration!</p>
        
        <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date(festival.date).toLocaleDateString()}</p>
          <p style="margin: 8px 0;"><strong>Location:</strong> ${festival.location}</p>
          <p style="margin: 8px 0;"><strong>Description:</strong> ${festival.description}</p>
        </div>

        <p style="color: #4b5563;">Plan your visit now and experience the culture of Bihar!</p>
        
        <p style="color: #4b5563; margin-top: 30px;">Cheers,<br><strong>Bihar Tourism Team</strong></p>
      </div>
    </div>
  `,
};

module.exports = {
  sendEmail,
  emailTemplates,
};
