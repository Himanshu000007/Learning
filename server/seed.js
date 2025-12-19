const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('./models/Course');
const LearningPath = require('./models/LearningPath');
const User = require('./models/User');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Course.deleteMany({});
        await LearningPath.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        // Create Admin User
        await User.create({
            name: 'Admin User',
            email: 'admin@dynamolearn.com',
            password: 'admin123',
            role: 'admin',
            avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff'
        });
        console.log('Created admin user: admin@dynamolearn.com / admin123');

        // Create Student User
        await User.create({
            name: 'John Student',
            email: 'student@example.com',
            password: 'password123',
            role: 'student',
            avatar: 'https://ui-avatars.com/api/?name=John+Student'
        });
        console.log('Created student user');

        // Seed Courses
        const courses = await Course.insertMany([
            {
                title: 'React Fundamentals',
                description: 'Learn the core concepts of React including components, state, props, and hooks. Build interactive UIs with the most popular frontend library.',
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
                category: 'Web Development',
                difficulty: 'Beginner',
                duration: '4 hours',
                modules: [
                    { title: 'Introduction to React', videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0', duration: '30 min', order: 1 },
                    { title: 'Components & Props', videoUrl: 'https://www.youtube.com/embed/S4VH8hddg8c', duration: '45 min', order: 2 },
                    { title: 'State & Lifecycle', videoUrl: 'https://www.youtube.com/embed/4pO-HcG2igk', duration: '50 min', order: 3 },
                    { title: 'Hooks Deep Dive', videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q', duration: '1 hour', order: 4 }
                ],
                instructor: { name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                rating: 4.8,
                enrolledCount: 15420,
                tags: ['react', 'javascript', 'frontend', 'hooks']
            },
            {
                title: 'Node.js & Express Masterclass',
                description: 'Build powerful backend APIs with Node.js and Express. Learn REST APIs, authentication, database integration, and deployment.',
                thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
                category: 'Web Development',
                difficulty: 'Intermediate',
                duration: '6 hours',
                modules: [
                    { title: 'Node.js Basics', videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4', duration: '40 min', order: 1 },
                    { title: 'Express Framework', videoUrl: 'https://www.youtube.com/embed/SccSCuHhOw0', duration: '1 hour', order: 2 },
                    { title: 'REST API Design', videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48', duration: '1 hour', order: 3 },
                    { title: 'MongoDB Integration', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk', duration: '1.5 hours', order: 4 },
                    { title: 'Authentication with JWT', videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4', duration: '1 hour', order: 5 }
                ],
                instructor: { name: 'Sarah Miller', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                rating: 4.9,
                enrolledCount: 12350,
                tags: ['node', 'express', 'backend', 'api', 'mongodb']
            },
            {
                title: 'Python for Data Science',
                description: 'Master Python for data analysis, visualization, and machine learning. Work with pandas, numpy, matplotlib, and scikit-learn.',
                thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
                category: 'Data Science',
                difficulty: 'Beginner',
                duration: '8 hours',
                modules: [
                    { title: 'Python Basics', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '1 hour', order: 1 },
                    { title: 'NumPy Fundamentals', videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI', duration: '1.5 hours', order: 2 },
                    { title: 'Pandas for Data Analysis', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', duration: '2 hours', order: 3 },
                    { title: 'Data Visualization', videoUrl: 'https://www.youtube.com/embed/3Xc3CA655Y4', duration: '1.5 hours', order: 4 }
                ],
                instructor: { name: 'Dr. Emily Chen', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
                rating: 4.7,
                enrolledCount: 23500,
                tags: ['python', 'data-science', 'pandas', 'numpy', 'visualization']
            },
            {
                title: 'Machine Learning Fundamentals',
                description: 'Understand the core concepts of machine learning. Learn supervised and unsupervised learning, neural networks, and model evaluation.',
                thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
                category: 'Machine Learning',
                difficulty: 'Advanced',
                duration: '10 hours',
                modules: [
                    { title: 'ML Introduction', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU', duration: '45 min', order: 1 },
                    { title: 'Supervised Learning', videoUrl: 'https://www.youtube.com/embed/d12ra3b_M-0', duration: '2 hours', order: 2 },
                    { title: 'Neural Networks', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk', duration: '2.5 hours', order: 3 }
                ],
                instructor: { name: 'Prof. Michael Brown', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
                rating: 4.6,
                enrolledCount: 8900,
                tags: ['machine-learning', 'ai', 'neural-networks', 'deep-learning']
            },
            {
                title: 'UI/UX Design Principles',
                description: 'Learn the fundamentals of user interface and experience design. Create beautiful, user-centered designs using Figma.',
                thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
                category: 'Design',
                difficulty: 'Beginner',
                duration: '5 hours',
                modules: [
                    { title: 'Design Thinking', videoUrl: 'https://www.youtube.com/embed/gHGN6hs2gZY', duration: '40 min', order: 1 },
                    { title: 'Color Theory', videoUrl: 'https://www.youtube.com/embed/_2LLXnUdUIc', duration: '50 min', order: 2 },
                    { title: 'Typography', videoUrl: 'https://www.youtube.com/embed/HnpsOtIcfbo', duration: '45 min', order: 3 },
                    { title: 'Figma Mastery', videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8', duration: '2 hours', order: 4 }
                ],
                instructor: { name: 'Lisa Park', avatar: 'https://randomuser.me/api/portraits/women/55.jpg' },
                rating: 4.8,
                enrolledCount: 11200,
                tags: ['design', 'ui', 'ux', 'figma', 'user-experience']
            },
            {
                title: 'Docker & Kubernetes',
                description: 'Master containerization and orchestration. Deploy scalable applications using Docker and Kubernetes on cloud platforms.',
                thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
                category: 'DevOps',
                difficulty: 'Advanced',
                duration: '7 hours',
                modules: [
                    { title: 'Docker Basics', videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo', duration: '1.5 hours', order: 1 },
                    { title: 'Docker Compose', videoUrl: 'https://www.youtube.com/embed/Qw9zlE3t8Ko', duration: '1 hour', order: 2 },
                    { title: 'Kubernetes Intro', videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do', duration: '2.5 hours', order: 3 }
                ],
                instructor: { name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' },
                rating: 4.5,
                enrolledCount: 7600,
                tags: ['docker', 'kubernetes', 'devops', 'containers', 'cloud']
            }
        ]);

        console.log(`Inserted ${courses.length} courses`);

        // Seed Learning Paths
        await LearningPath.insertMany([
            {
                title: 'Full Stack Developer',
                description: 'Become a complete full-stack developer with React, Node.js, and MongoDB. Build production-ready web applications.',
                thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
                nodes: [
                    { title: 'React Fundamentals', status: 'completed', courseId: courses[0]._id, position: { x: 20, y: 30 }, order: 1 },
                    { title: 'Node.js & Express', status: 'active', courseId: courses[1]._id, position: { x: 50, y: 50 }, order: 2 },
                    { title: 'UI/UX Design', status: 'locked', courseId: courses[4]._id, position: { x: 80, y: 30 }, order: 3 },
                    { title: 'DevOps Basics', status: 'locked', courseId: courses[5]._id, position: { x: 50, y: 80 }, order: 4 }
                ],
                connections: [
                    { from: 0, to: 1 },
                    { from: 1, to: 2 },
                    { from: 1, to: 3 }
                ],
                category: 'Web Development',
                estimatedDuration: '3 months',
                enrolledCount: 4520
            },
            {
                title: 'Data Science Expert',
                description: 'Master data science from Python basics to advanced machine learning. Analyze, visualize, and predict with confidence.',
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
                nodes: [
                    { title: 'Python for Data Science', status: 'completed', courseId: courses[2]._id, position: { x: 30, y: 25 }, order: 1 },
                    { title: 'Machine Learning', status: 'active', courseId: courses[3]._id, position: { x: 70, y: 50 }, order: 2 }
                ],
                connections: [
                    { from: 0, to: 1 }
                ],
                category: 'Data Science',
                estimatedDuration: '4 months',
                enrolledCount: 3200
            }
        ]);

        console.log('Inserted learning paths');
        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
