const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./utils/db');
const { verifyToken, extractToken } = require('./utils/auth');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const analytics = db.collection('analytics');
    const projects = db.collection('projects');
    const users = db.collection('users');

    // GET - Fetch analytics data
    if (event.httpMethod === 'GET') {
      const { type, period } = event.queryStringParameters || {};

      // Calculate date range
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days
      }

      if (type === 'overview') {
        // Get overview analytics
        const [
          totalProjects,
          totalEvents,
          recentActivity,
          componentUsage,
          userStats
        ] = await Promise.all([
          projects.countDocuments({ userId: decoded.userId }),
          analytics.countDocuments({ 
            userId: decoded.userId,
            timestamp: { $gte: startDate }
          }),
          analytics.find({ 
            userId: decoded.userId,
            timestamp: { $gte: startDate }
          })
          .sort({ timestamp: -1 })
          .limit(10)
          .toArray(),
          analytics.aggregate([
            { 
              $match: { 
                userId: decoded.userId,
                eventType: 'component_used',
                timestamp: { $gte: startDate }
              }
            },
            {
              $group: {
                _id: '$data.componentType',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]).toArray(),
          users.findOne(
            { _id: new ObjectId(decoded.userId) },
            { projection: { stats: 1 } }
          )
        ]);

        // Get daily activity for chart
        const dailyActivity = await analytics.aggregate([
          {
            $match: {
              userId: decoded.userId,
              timestamp: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$timestamp'
                }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id': 1 } }
        ]).toArray();

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            analytics: {
              overview: {
                totalProjects,
                totalEvents,
                userStats: userStats?.stats || {}
              },
              dailyActivity,
              recentActivity,
              componentUsage
            }
          })
        };
      }

      // Get specific analytics type
      const events = await analytics.find({
        userId: decoded.userId,
        ...(type && { eventType: type }),
        timestamp: { $gte: startDate }
      })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          events
        })
      };
    }

    // POST - Track analytics event
    if (event.httpMethod === 'POST') {
      const eventData = JSON.parse(event.body);
      const { eventType, data, metadata } = eventData;

      if (!eventType) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Event type is required' })
        };
      }

      const analyticsEvent = {
        userId: decoded.userId,
        eventType,
        data: data || {},
        metadata: {
          userAgent: event.headers['user-agent'],
          ip: event.headers['client-ip'] || event.headers['x-forwarded-for'],
          ...metadata
        },
        timestamp: new Date()
      };

      await analytics.insertOne(analyticsEvent);

      // Update user stats based on event type
      const statUpdates = {};
      switch (eventType) {
        case 'component_used':
          statUpdates['stats.componentsUsed'] = 1;
          break;
        case 'time_spent':
          statUpdates['stats.timeSpent'] = data.duration || 0;
          break;
        case 'project_created':
          statUpdates['stats.projectsCreated'] = 1;
          break;
      }

      if (Object.keys(statUpdates).length > 0) {
        await users.updateOne(
          { _id: new ObjectId(decoded.userId) },
          { $inc: statUpdates }
        );
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Event tracked successfully'
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Analytics operation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
