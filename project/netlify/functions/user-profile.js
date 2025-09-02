const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./utils/db');
const { verifyToken, extractToken, hashPassword, comparePassword } = require('./utils/auth');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
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

  try {
    // Extract and verify token
    const token = extractToken(event.headers);
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authorization token required' })
      };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid or expired token' })
      };
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    // GET - Fetch user profile
    if (event.httpMethod === 'GET') {
      const user = await users.findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { password: 0 } }
      );

      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          user
        })
      };
    }

    // PUT - Update user profile
    if (event.httpMethod === 'PUT') {
      const updateData = JSON.parse(event.body);
      const { action, ...data } = updateData;

      let updateQuery = {};

      switch (action) {
        case 'profile':
          // Update basic profile information
          const { name, profile } = data;
          updateQuery = {
            $set: {
              ...(name && { name }),
              ...(profile && { profile: { ...profile } }),
              updatedAt: new Date()
            }
          };
          break;

        case 'preferences':
          // Update user preferences
          const { preferences } = data;
          updateQuery = {
            $set: {
              preferences: { ...preferences },
              updatedAt: new Date()
            }
          };
          break;

        case 'password':
          // Change password
          const { currentPassword, newPassword } = data;
          
          // Verify current password
          const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
          const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
          
          if (!isCurrentPasswordValid) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Current password is incorrect' })
            };
          }

          // Hash new password
          const hashedNewPassword = await hashPassword(newPassword);
          updateQuery = {
            $set: {
              password: hashedNewPassword,
              updatedAt: new Date()
            }
          };
          break;

        case 'stats':
          // Update user statistics
          const { stats } = data;
          updateQuery = {
            $inc: {
              'stats.projectsCreated': stats.projectsCreated || 0,
              'stats.componentsUsed': stats.componentsUsed || 0,
              'stats.timeSpent': stats.timeSpent || 0
            },
            $set: {
              updatedAt: new Date()
            }
          };
          break;

        default:
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action specified' })
          };
      }

      const result = await users.updateOne(
        { _id: new ObjectId(decoded.userId) },
        updateQuery
      );

      if (result.matchedCount === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' })
        };
      }

      // Fetch updated user
      const updatedUser = await users.findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { password: 0 } }
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Profile updated successfully',
          user: updatedUser
        })
      };
    }

    // DELETE - Delete user account
    if (event.httpMethod === 'DELETE') {
      const { password } = JSON.parse(event.body);

      // Verify password before deletion
      const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Password is incorrect' })
        };
      }

      // Soft delete - mark as inactive
      await users.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { 
          $set: { 
            isActive: false,
            deletedAt: new Date()
          }
        }
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Account deleted successfully'
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Profile operation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
