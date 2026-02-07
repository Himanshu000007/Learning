const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('./models/Course');
const LearningPath = require('./models/LearningPath');
const Quiz = require('./models/Quiz');

// VALID, EMBEDDABLE URLs (Traversy, Mosh, FreeCodeCamp, etc.)
const URLS = {
    HTML: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
    CSS: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
    JS: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
    REACT: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    NODE: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
    MONGO: 'https://www.youtube.com/watch?v=3ER8tBJeZzw',
    OS: 'https://www.youtube.com/watch?v=vBURTt97ekA', // Core Electronics
    DBMS: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', // Mosh SQL
    NETWORKS: 'https://www.youtube.com/watch?v=IPvYjXCsTg8', // PowerCert
    DSA: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', // FreeCodeCamp
    OOP: 'https://www.youtube.com/watch?v=pTB0EiLXUC8', // Mosh OOP
    DESIGN: 'https://www.youtube.com/watch?v=m7lveVIuWTA', // Satori Graphics
    SYSTEM: 'https://www.youtube.com/watch?v=xpDnVSmNFX0' // Gaurav Sen (Usually open)
};

const courses = [
    // ===== FRONTEND DEVELOPMENT =====
    {
        title: 'HTML & CSS Fundamentals',
        description: 'Master the building blocks of web development. Learn HTML5 semantic markup and modern CSS3 styling techniques.',
        category: 'Frontend',
        level: 'Beginner',
        duration: '8 hours',
        rating: 4.8,
        enrolledCount: 15420,
        thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400',
        instructor: 'Sarah Johnson',
        modules: [
            {
                title: 'Introduction to HTML',
                lessons: [
                    { title: 'What is HTML?', duration: '10:00', youtubeUrl: URLS.HTML },
                    { title: 'HTML Document Structure', duration: '15:00', youtubeUrl: URLS.HTML },
                    { title: 'HTML Elements & Tags', duration: '20:00', youtubeUrl: URLS.HTML }
                ]
            },
            {
                title: 'CSS Basics',
                lessons: [
                    { title: 'CSS Selectors', duration: '18:00', youtubeUrl: URLS.CSS },
                    { title: 'Box Model', duration: '15:00', youtubeUrl: URLS.CSS },
                    { title: 'Flexbox Layout', duration: '25:00', youtubeUrl: URLS.CSS },
                    { title: 'CSS Grid', duration: '30:00', youtubeUrl: URLS.CSS }
                ]
            }
        ]
    },
    {
        title: 'JavaScript Complete Guide',
        description: 'From basics to advanced concepts. Learn modern ES6+ JavaScript with practical projects.',
        category: 'Frontend',
        level: 'Beginner to Advanced',
        duration: '25 hours',
        rating: 4.9,
        enrolledCount: 32150,
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
        instructor: 'Jonas Schmedtmann',
        modules: [
            {
                title: 'JavaScript Fundamentals',
                lessons: [
                    { title: 'Variables & Data Types', duration: '20:00', youtubeUrl: URLS.JS },
                    { title: 'Operators & Expressions', duration: '15:00', youtubeUrl: URLS.JS },
                    { title: 'Control Flow', duration: '25:00', youtubeUrl: URLS.JS },
                    { title: 'Functions', duration: '30:00', youtubeUrl: URLS.JS }
                ]
            },
            {
                title: 'Arrays & Objects',
                lessons: [
                    { title: 'Array Methods', duration: '35:00', youtubeUrl: URLS.JS },
                    { title: 'Object Manipulation', duration: '25:00', youtubeUrl: URLS.JS }
                ]
            },
            {
                title: 'Async JavaScript',
                lessons: [
                    { title: 'Callbacks & Promises', duration: '30:00', youtubeUrl: URLS.JS },
                    { title: 'Async/Await', duration: '25:00', youtubeUrl: URLS.JS },
                    { title: 'Fetch API', duration: '20:00', youtubeUrl: URLS.JS }
                ]
            }
        ]
    },
    {
        title: 'React - The Complete Guide',
        description: 'Build powerful, fast, user-friendly and reactive web apps with React.js',
        category: 'Frontend',
        level: 'Intermediate',
        duration: '40 hours',
        rating: 4.9,
        enrolledCount: 45780,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        instructor: 'Maximilian Schwarzmüller',
        modules: [
            {
                title: 'React Basics',
                lessons: [
                    { title: 'What is React?', duration: '15:00', youtubeUrl: URLS.REACT },
                    { title: 'Components & JSX', duration: '30:00', youtubeUrl: URLS.REACT },
                    { title: 'Props & State', duration: '35:00', youtubeUrl: URLS.REACT }
                ]
            },
            {
                title: 'React Hooks',
                lessons: [
                    { title: 'useState Hook', duration: '25:00', youtubeUrl: URLS.REACT },
                    { title: 'useEffect Hook', duration: '30:00', youtubeUrl: URLS.REACT }
                ]
            }
        ]
    },
    // ===== BACKEND DEVELOPMENT =====
    {
        title: 'Node.js & Express Masterclass',
        description: 'Build scalable backend applications with Node.js and Express. RESTful APIs, authentication, and more.',
        category: 'Backend',
        level: 'Intermediate',
        duration: '30 hours',
        rating: 4.8,
        enrolledCount: 28340,
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
        instructor: 'Brad Traversy',
        modules: [
            {
                title: 'Node.js Fundamentals',
                lessons: [
                    { title: 'Introduction to Node.js', duration: '20:00', youtubeUrl: URLS.NODE },
                    { title: 'Node.js Modules', duration: '25:00', youtubeUrl: URLS.NODE }
                ]
            },
            {
                title: 'Express.js',
                lessons: [
                    { title: 'Express Setup', duration: '15:00', youtubeUrl: URLS.NODE },
                    { title: 'Routing & Middleware', duration: '30:00', youtubeUrl: URLS.NODE }
                ]
            }
        ]
    },
    {
        title: 'MongoDB Complete Developer Guide',
        description: 'Master MongoDB and Mongoose for Node.js applications. NoSQL database fundamentals to advanced queries.',
        category: 'Backend',
        level: 'Intermediate',
        duration: '18 hours',
        rating: 4.7,
        enrolledCount: 19520,
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
        instructor: 'Academind',
        modules: [
            {
                title: 'MongoDB Basics',
                lessons: [
                    { title: 'Introduction to MongoDB', duration: '20:00', youtubeUrl: URLS.MONGO },
                    { title: 'CRUD Operations', duration: '30:00', youtubeUrl: URLS.MONGO }
                ]
            }
        ]
    },

    // ===== DATA STRUCTURES & ALGORITHMS =====
    {
        title: 'Data Structures & Algorithms',
        description: 'Master DSA for coding interviews. Arrays, Linked Lists, Trees, Graphs, Dynamic Programming.',
        category: 'DSA',
        level: 'Intermediate',
        duration: '50 hours',
        rating: 4.9,
        enrolledCount: 52340,
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
        instructor: 'Abdul Bari',
        modules: [
            {
                title: 'Arrays & Strings',
                lessons: [
                    { title: 'Array Fundamentals', duration: '25:00', youtubeUrl: URLS.DSA },
                    { title: 'Two Pointer Technique', duration: '30:00', youtubeUrl: URLS.DSA }
                ]
            },
            {
                title: 'Linked Lists',
                lessons: [
                    { title: 'Singly Linked List', duration: '30:00', youtubeUrl: URLS.DSA },
                    { title: 'Doubly Linked List', duration: '25:00', youtubeUrl: URLS.DSA }
                ]
            }
        ]
    },

    // ===== OPERATING SYSTEMS =====
    {
        title: 'Operating Systems Concepts',
        description: 'Understand OS internals - processes, threads, memory management, file systems, and more.',
        category: 'Computer Science',
        level: 'Intermediate',
        duration: '35 hours',
        rating: 4.8,
        enrolledCount: 24680,
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
        instructor: 'Gate Smashers',
        modules: [
            {
                title: 'Process Management',
                lessons: [
                    { title: 'Processes & Threads', duration: '30:00', youtubeUrl: URLS.OS },
                    { title: 'CPU Scheduling', duration: '40:00', youtubeUrl: URLS.OS }
                ]
            }
        ]
    },

    // ===== DBMS =====
    {
        title: 'Database Management Systems',
        description: 'Complete DBMS course - SQL, Normalization, Transactions, Indexing, and query optimization.',
        category: 'Computer Science',
        level: 'Intermediate',
        duration: '28 hours',
        rating: 4.7,
        enrolledCount: 21350,
        thumbnail: 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?w=400',
        instructor: 'Jenny\'s Lectures',
        modules: [
            {
                title: 'SQL Fundamentals',
                lessons: [
                    { title: 'SQL Basics', duration: '30:00', youtubeUrl: URLS.DBMS },
                    { title: 'Joins & Subqueries', duration: '40:00', youtubeUrl: URLS.DBMS }
                ]
            }
        ]
    },

    // ===== SCHOOL OF OOP =====
    {
        title: 'Object-Oriented Programming',
        description: 'Master OOP concepts - Classes, Objects, Inheritance, Polymorphism, Abstraction, Encapsulation.',
        category: 'Computer Science',
        level: 'Beginner',
        duration: '20 hours',
        rating: 4.8,
        enrolledCount: 28740,
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
        instructor: 'Telusko',
        modules: [
            {
                title: 'OOP Fundamentals',
                lessons: [
                    { title: 'Classes & Objects', duration: '25:00', youtubeUrl: URLS.OOP },
                    { title: 'Inheritance', duration: '20:00', youtubeUrl: URLS.OOP }
                ]
            }
        ]
    },

    // ===== UI/UX DESIGN =====
    {
        title: 'UI/UX Design Fundamentals',
        description: 'Learn user-centered design. Wireframing, prototyping, user research, and design systems.',
        category: 'Design',
        level: 'Beginner',
        duration: '22 hours',
        rating: 4.7,
        enrolledCount: 16840,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        instructor: 'Flux Academy',
        modules: [
            {
                title: 'Design Principles',
                lessons: [
                    { title: 'UI Design Basics', duration: '30:00', youtubeUrl: URLS.DESIGN },
                    { title: 'Color Theory', duration: '25:00', youtubeUrl: URLS.DESIGN }
                ]
            }
        ]
    },

    // ===== SYSTEM DESIGN =====
    {
        title: 'System Design Fundamentals',
        description: 'Learn to design scalable systems. Load balancing, caching, databases, microservices architecture.',
        category: 'System Design',
        level: 'Advanced',
        duration: '35 hours',
        rating: 4.9,
        enrolledCount: 31250,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        instructor: 'Gaurav Sen',
        modules: [
            {
                title: 'Fundamentals',
                lessons: [
                    { title: 'Scalability Basics', duration: '30:00', youtubeUrl: URLS.SYSTEM },
                    { title: 'Load Balancing', duration: '25:00', youtubeUrl: URLS.SYSTEM }
                ]
            }
        ]
    },

    // ===== COMPUTER NETWORKS =====
    {
        title: 'Computer Networks',
        description: 'Master networking concepts - OSI model, TCP/IP, routing, DNS, HTTP, and network security.',
        category: 'Computer Science',
        level: 'Intermediate',
        duration: '32 hours',
        rating: 4.8,
        enrolledCount: 18920,
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
        instructor: 'Neso Academy',
        modules: [
            {
                title: 'Network Fundamentals',
                lessons: [
                    { title: 'OSI Model', duration: '30:00', youtubeUrl: URLS.NETWORKS },
                    { title: 'TCP/IP Model', duration: '25:00', youtubeUrl: URLS.NETWORKS }
                ]
            }
        ]
    }
];

const quizzes = [
    {
        title: 'Frontend Basics Quiz',
        passingScore: 70,
        questions: [
            {
                question: 'What does HTML stand for?',
                options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Text Language', 'Home Tool Markup Language'],
                correctAnswer: 0
            },
            {
                question: 'Which tag is used to define an internal style sheet?',
                options: ['<script>', '<style>', '<css>', '<link>'],
                correctAnswer: 1
            },
            {
                question: 'What is the correct HTML element for inserting a line break?',
                options: ['<lb>', '<break>', '<br>', '<newline>'],
                correctAnswer: 2
            }
        ]
    },
    {
        title: 'JavaScript Mastery Quiz',
        passingScore: 60,
        questions: [
            {
                question: 'Which company developed JavaScript?',
                options: ['Microsoft', 'Sun Microsystems', 'Netscape', 'Oracle'],
                correctAnswer: 2
            },
            {
                question: 'Which symbol is used for comments in JavaScript?',
                options: ['<!-- -->', '//', '/* */', '**'],
                correctAnswer: 1
            },
            {
                question: 'How do you declare a JavaScript variable?',
                options: ['v myVar', 'variable myVar', 'var myVar', 'val myVar'],
                correctAnswer: 2
            }
        ]
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Course.deleteMany({});
        await LearningPath.deleteMany({});
        await Quiz.deleteMany({});

        // Use with caution in prod, but helpful for development consistency
        // const UserProgress = require('./models/UserProgress');
        // await UserProgress.deleteMany({});

        console.log('Cleared existing data');

        // Insert Courses
        const createdCourses = await Course.insertMany(courses);
        console.log(`Inserted ${createdCourses.length} courses`);

        // Insert Quizzes
        const createdQuizzes = await Quiz.insertMany(quizzes);
        console.log(`Inserted ${createdQuizzes.length} quizzes`);

        // Helper to find ID
        const getCourseId = (title) => createdCourses.find(c => c.title === title)?._id;
        const getQuizId = (title) => createdQuizzes.find(q => q.title === title)?._id;

        if (!getCourseId('HTML & CSS Fundamentals') || !getCourseId('JavaScript Complete Guide')) {
            throw new Error("Critical courses missing for path generation");
        }

        // Define Paths with References
        const learningPaths = [
            {
                title: 'Full Stack Web Developer',
                description: 'Complete path from beginner to full stack developer',
                category: 'Development',
                estimatedDuration: '6 months',
                difficulty: 'Intermediate',
                nodes: [
                    {
                        title: 'HTML & CSS',
                        type: 'course',
                        courseId: getCourseId('HTML & CSS Fundamentals'),
                        status: 'active',
                        order: 1,
                        position: { x: 50, y: 15 }
                    },
                    {
                        title: 'Frontend Quiz',
                        type: 'quiz',
                        quizId: getQuizId('Frontend Basics Quiz'),
                        status: 'locked',
                        order: 2,
                        position: { x: 50, y: 35 }
                    },
                    {
                        title: 'JavaScript',
                        type: 'course',
                        courseId: getCourseId('JavaScript Complete Guide'),
                        status: 'locked',
                        order: 3,
                        position: { x: 50, y: 55 }
                    },
                    {
                        title: 'JS Challenge',
                        type: 'quiz',
                        quizId: getQuizId('JavaScript Mastery Quiz'),
                        status: 'locked',
                        order: 4,
                        position: { x: 50, y: 75 }
                    },
                    {
                        title: 'React',
                        type: 'course',
                        courseId: getCourseId('React - The Complete Guide'),
                        status: 'locked',
                        order: 5,
                        position: { x: 50, y: 95 }
                    }
                ],
                connections: [
                    { from: 0, to: 1 },
                    { from: 1, to: 2 },
                    { from: 2, to: 3 },
                    { from: 3, to: 4 }
                ]
            }
        ];

        // Insert learning paths
        await LearningPath.insertMany(learningPaths);
        console.log(`Inserted ${learningPaths.length} learning paths`);

        console.log('✅ Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
