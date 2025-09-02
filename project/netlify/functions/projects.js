const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./utils/db');
const { verifyToken, extractToken } = require('./utils/auth');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
    const projects = db.collection('projects');
    const users = db.collection('users');

    // GET - Fetch user projects
    if (event.httpMethod === 'GET') {
      const { projectId } = event.queryStringParameters || {};

      if (projectId) {
        // Fetch specific project
        const project = await projects.findOne({
          _id: new ObjectId(projectId),
          userId: decoded.userId
        });

        if (!project) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Project not found' })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            project
          })
        };
      } else {
        // Fetch all user projects
        const userProjects = await projects
          .find({ userId: decoded.userId })
          .sort({ updatedAt: -1 })
          .toArray();

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            projects: userProjects
          })
        };
      }
    }

    // POST - Create new project
    if (event.httpMethod === 'POST') {
      const projectData = JSON.parse(event.body);
      const { name, description, components, pages, settings } = projectData;

      if (!name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Project name is required' })
        };
      }

      const newProject = {
        userId: decoded.userId,
        name,
        description: description || '',
        components: components || [],
        pages: pages || [],
        settings: settings || {
          theme: 'light',
          responsive: true,
          framework: 'react'
        },
        metadata: {
          version: '1.0.0',
          framework: 'react',
          dependencies: []
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        tags: []
      };

      const result = await projects.insertOne(newProject);

      // Update user stats
      await users.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $inc: { 'stats.projectsCreated': 1 } }
      );

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Project created successfully',
          project: { ...newProject, _id: result.insertedId }
        })
      };
    }

    // PUT - Update existing project
    if (event.httpMethod === 'PUT') {
      const { projectId } = event.queryStringParameters || {};
      if (!projectId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Project ID is required' })
        };
      }

      const updateData = JSON.parse(event.body);
      const { name, description, components, pages, settings, metadata, tags } = updateData;

      const updateQuery = {
        $set: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(components && { components }),
          ...(pages && { pages }),
          ...(settings && { settings }),
          ...(metadata && { metadata }),
          ...(tags && { tags }),
          updatedAt: new Date()
        }
      };

      const result = await projects.updateOne(
        { 
          _id: new ObjectId(projectId),
          userId: decoded.userId 
        },
        updateQuery
      );

      if (result.matchedCount === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Project not found' })
        };
      }

      // Fetch updated project
      const updatedProject = await projects.findOne({
        _id: new ObjectId(projectId),
        userId: decoded.userId
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Project updated successfully',
          project: updatedProject
        })
      };
    }

    // DELETE - Delete project
    if (event.httpMethod === 'DELETE') {
      const { projectId } = event.queryStringParameters || {};
      if (!projectId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Project ID is required' })
        };
      }

      const result = await projects.deleteOne({
        _id: new ObjectId(projectId),
        userId: decoded.userId
      });

      if (result.deletedCount === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Project not found' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Project deleted successfully'
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Projects operation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
