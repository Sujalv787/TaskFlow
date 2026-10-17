import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin@1234',
      role: 'admin',
    });

    const testUser = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Test@1234',
      role: 'user',
    });

    console.log('✅ Users created');

    // Create sample tasks
    const tasks = [
      {
        title: 'Set up project infrastructure',
        description: 'Configure CI/CD pipelines, Docker containers, and cloud deployment.',
        priority: 'urgent',
        status: 'completed',
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        tags: ['devops', 'infrastructure'],
      },
      {
        title: 'Design database schema',
        description: 'Create Mongoose models for Users and Tasks with proper relationships.',
        priority: 'high',
        status: 'completed',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        assignedTo: testUser._id,
        createdBy: adminUser._id,
        tags: ['database', 'backend'],
      },
      {
        title: 'Implement authentication system',
        description: 'Build JWT authentication with register, login, and protected routes.',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        assignedTo: testUser._id,
        createdBy: adminUser._id,
        tags: ['auth', 'security'],
      },
      {
        title: 'Build task management UI',
        description: 'Create React components for task CRUD operations with filters.',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        assignedTo: testUser._id,
        createdBy: testUser._id,
        tags: ['frontend', 'react'],
      },
      {
        title: 'Write API documentation',
        description: 'Document all endpoints with Postman collection and README.',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        assignedTo: testUser._id,
        createdBy: adminUser._id,
        tags: ['docs'],
      },
      {
        title: 'Add dark mode support',
        description: 'Implement theme switching with CSS variables and localStorage persistence.',
        priority: 'low',
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedTo: testUser._id,
        createdBy: testUser._id,
        tags: ['ui', 'frontend'],
      },
      {
        title: 'Implement search and filters',
        description: 'Add real-time search by title and filters for status/priority.',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        assignedTo: null,
        createdBy: adminUser._id,
        tags: ['feature', 'search'],
      },
      {
        title: 'Deploy to production',
        description: 'Deploy frontend to Vercel and backend to Render.',
        priority: 'urgent',
        status: 'pending',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        tags: ['deployment'],
      },
    ];

    await Task.insertMany(tasks);
    console.log('✅ Tasks created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Admin: admin@example.com / Admin@1234');
    console.log('   User:  testuser@example.com / Test@1234');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
