const { connectToDatabase } = require('./utils/db');
const { hashPassword, generateToken, isValidEmail, isValidPassword, generateAvatar } = require('./utils/auth');

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
    const { name, email, password } = JSON.parse(event.body);

    // Validation
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name, email, and password are required' })
      };
    }

    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    if (!isValidPassword(password)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Password must be at least 6 characters and contain both letters and numbers' 
        })
      };
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ error: 'User already exists with this email' })
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate avatar
    const avatar = generateAvatar(name, email);

    // Create user
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar,
      profile: {
        bio: '',
        company: '',
        website: '',
        location: '',
        skills: []
      },
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true,
        autoSave: true
      },
      stats: {
        projectsCreated: 0,
        componentsUsed: 0,
        timeSpent: 0
      },
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    };

    const result = await users.insertOne(newUser);

    // Generate JWT token
    const token = generateToken(result.insertedId.toString());

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    userWithoutPassword._id = result.insertedId;

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'User registered successfully',
        user: userWithoutPassword,
        token
      })
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
