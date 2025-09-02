const { connectToDatabase } = require('./utils/db');
const { comparePassword, generateToken, isValidEmail } = require('./utils/auth');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    // Validation
    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Account is deactivated' })
      };
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }

    // Update last login
    await users.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    userWithoutPassword.lastLogin = new Date();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        token
      })
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
