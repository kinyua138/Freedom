// Netlify Function for handling contact form submissions
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    // Basic validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields: name, email, and message are required' 
        }),
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Here you would typically:
    // 1. Send email using a service like SendGrid, Mailgun, etc.
    // 2. Save to database
    // 3. Send to CRM system
    
    // For now, we'll just log and return success
    console.log('Contact form submission:', { name, email, message });

    // You can integrate with email services here
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: 'your-email@example.com',
      from: 'noreply@your-domain.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };
    
    await sgMail.send(msg);
    */

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message! We\'ll get back to you soon.' 
      }),
    };

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error. Please try again later.' 
      }),
    };
  }
};
