import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';

// Collection name in Firebase
const BLOG_COLLECTION = 'blogs';

// Default blog data (fallback)
// export const defaultBlogs = [
//   {
//     id: 'BLOG_01',
//     title: 'Getting Started with React and Firebase',
//     author: 'Karrtik Gupta',
//     publishDate: '2025-01-05',
//     category: 'Web Development',
//     hashtags: ['react', 'firebase', 'javascript', 'webdev'],
//     excerpt: 'Learn how to integrate Firebase with your React applications for real-time data synchronization and authentication.',
//     content: `
// # Getting Started with React and Firebase

// Firebase has become one of the most popular Backend-as-a-Service (BaaS) platforms for modern web applications. In this comprehensive guide, we'll explore how to integrate Firebase with React applications.

// ## Why Firebase?

// Firebase offers a suite of tools that make development faster and more efficient:
// - **Real-time Database**: Synchronize data across all clients in real-time
// - **Authentication**: Built-in authentication with multiple providers
// - **Cloud Storage**: Store and serve user-generated content
// - **Hosting**: Deploy your apps with a single command

// ## Setting Up Firebase

// First, install the Firebase SDK:

// \`\`\`bash
// npm install firebase
// \`\`\`

// Then, initialize Firebase in your project:

// \`\`\`javascript
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// \`\`\`

// ## Building Real-time Features

// Firebase makes it incredibly easy to build real-time features. Here's a simple example of fetching data:

// \`\`\`javascript
// import { collection, getDocs } from 'firebase/firestore';

// const fetchData = async () => {
//   const querySnapshot = await getDocs(collection(db, "users"));
//   querySnapshot.forEach((doc) => {
//     console.log(doc.id, " => ", doc.data());
//   });
// };
// \`\`\`

// ## Conclusion

// Firebase and React make a powerful combination for building modern web applications. The ease of setup and real-time capabilities make it an excellent choice for your next project.

// Happy coding! 🚀
//     `,
//     imageUrl: '/blog-firebase.png',
//     readTime: '5 min read',
//     views: 234
//   },
//   {
//     id: 'BLOG_02',
//     title: 'Mastering Framer Motion Animations',
//     author: 'Karrtik Gupta',
//     publishDate: '2025-01-03',
//     category: 'Frontend',
//     hashtags: ['framer-motion', 'react', 'animations', 'ui'],
//     excerpt: 'Discover advanced techniques for creating smooth, professional animations in React using Framer Motion library.',
//     content: `
// # Mastering Framer Motion Animations

// Framer Motion is a production-ready motion library for React that makes creating animations incredibly simple yet powerful.

// ## Why Framer Motion?

// - **Declarative**: Animations are defined in a simple, declarative way
// - **Performance**: Hardware-accelerated animations
// - **Gestures**: Built-in support for drag, hover, and tap gestures
// - **Layout Animations**: Animate layout changes automatically

// ## Basic Animations

// Here's a simple fade-in animation:

// \`\`\`jsx
// import { motion } from 'framer-motion';

// function Component() {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       Hello World
//     </motion.div>
//   );
// }
// \`\`\`

// ## Advanced Techniques

// ### Stagger Animations

// Create beautiful staggered animations for lists:

// \`\`\`jsx
// const container = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1
//     }
//   }
// };

// const item = {
//   hidden: { opacity: 0, y: 20 },
//   show: { opacity: 1, y: 0 }
// };

// function List() {
//   return (
//     <motion.ul variants={container} initial="hidden" animate="show">
//       {items.map(item => (
//         <motion.li key={item.id} variants={item}>
//           {item.name}
//         </motion.li>
//       ))}
//     </motion.ul>
//   );
// }
// \`\`\`

// ### Layout Animations

// One of the most powerful features is layout animations:

// \`\`\`jsx
// <motion.div layout>
//   Content that animates when layout changes
// </motion.div>
// \`\`\`

// ## Performance Tips

// 1. Use \`transform\` and \`opacity\` for best performance
// 2. Avoid animating \`width\`, \`height\`, or \`top/left\`
// 3. Use \`layoutId\` for shared element transitions
// 4. Leverage \`useReducedMotion\` for accessibility

// ## Conclusion

// Framer Motion opens up a world of possibilities for creating engaging user interfaces. Start simple and gradually incorporate more advanced techniques as you become comfortable with the library.
//     `,
//     imageUrl: '/blog-framer.png',
//     readTime: '7 min read',
//     views: 456
//   },
//   {
//     id: 'BLOG_03',
//     title: 'Building Scalable Node.js APIs',
//     author: 'Karrtik Gupta',
//     publishDate: '2024-12-28',
//     category: 'Backend',
//     hashtags: ['nodejs', 'express', 'api', 'backend'],
//     excerpt: 'Best practices and architectural patterns for building maintainable and scalable RESTful APIs with Node.js and Express.',
//     content: `
// # Building Scalable Node.js APIs

// Building APIs that can scale and remain maintainable is crucial for modern web applications. Let's explore best practices for Node.js API development.

// ## Project Structure

// A well-organized project structure is essential:

// \`\`\`
// project/
// ├── src/
// │   ├── controllers/
// │   ├── models/
// │   ├── routes/
// │   ├── middleware/
// │   ├── utils/
// │   └── config/
// ├── tests/
// └── server.js
// \`\`\`

// ## Setting Up Express

// \`\`\`javascript
// const express = require('express');
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/posts', postRoutes);

// // Error handling
// app.use(errorHandler);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(\`Server running on port \${PORT}\`);
// });
// \`\`\`

// ## Best Practices

// ### 1. Use Environment Variables

// Never hardcode sensitive information:

// \`\`\`javascript
// require('dotenv').config();

// const config = {
//   port: process.env.PORT,
//   dbUrl: process.env.DATABASE_URL,
//   jwtSecret: process.env.JWT_SECRET
// };
// \`\`\`

// ### 2. Implement Proper Error Handling

// \`\`\`javascript
// class AppError extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = true;
//   }
// }

// const errorHandler = (err, req, res, next) => {
//   const { statusCode = 500, message } = err;
//   res.status(statusCode).json({
//     status: 'error',
//     statusCode,
//     message
//   });
// };
// \`\`\`

// ### 3. Use Async/Await with Try-Catch

// \`\`\`javascript
// const getUser = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       throw new AppError('User not found', 404);
//     }
//     res.json({ success: true, data: user });
//   } catch (error) {
//     next(error);
//   }
// };
// \`\`\`

// ## Database Integration

// Use connection pooling and optimize queries:

// \`\`\`javascript
// const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   max: 20,
//   idleTimeoutMillis: 30000
// });
// \`\`\`

// ## Security Best Practices

// 1. **Use Helmet.js** for security headers
// 2. **Implement Rate Limiting** to prevent abuse
// 3. **Validate Input** with libraries like Joi
// 4. **Use CORS** properly
// 5. **Keep Dependencies Updated**

// ## Conclusion

// Building scalable APIs requires careful planning and adherence to best practices. Start with a solid foundation and iterate as your application grows.
//     `,
//     imageUrl: '/blog-nodejs.png',
//     readTime: '10 min read',
//     views: 789
//   }
// ];
export const defaultBlogs = [];
/**
 * Fetch all blogs from Firebase with fallback to default data
 */
export const getBlogs = async () => {
  try {
    if (!db) {
      console.warn('Firebase not initialized, using default blogs');
      return defaultBlogs;
    }

    const blogsCollection = collection(db, BLOG_COLLECTION);
    const q = query(blogsCollection, orderBy('publishDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No blogs found in Firebase, using default data');
      return defaultBlogs;
    }

    const blogs = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });

    return blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return defaultBlogs;
  }
};

/**
 * Fetch a single blog by ID
 */
export const getBlogById = async (blogId) => {
  try {
    if (!db) {
      console.warn('Firebase not initialized, using default blogs');
      return defaultBlogs.find(blog => blog.id === blogId) || null;
    }

    const blogRef = doc(db, BLOG_COLLECTION, blogId);
    const blogSnap = await getDoc(blogRef);

    if (blogSnap.exists()) {
      return { id: blogSnap.id, ...blogSnap.data() };
    } else {
      // Fallback to default blogs
      return defaultBlogs.find(blog => blog.id === blogId) || null;
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    return defaultBlogs.find(blog => blog.id === blogId) || null;
  }
};

/**
 * Add a new blog to Firebase
 */
export const addBlog = async (blogData) => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    // Generate a unique ID
    const blogId = `BLOG_${Date.now()}`;
    const blogRef = doc(db, BLOG_COLLECTION, blogId);
    
    const newBlog = {
      ...blogData,
      publishDate: blogData.publishDate || new Date().toISOString().split('T')[0],
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(blogRef, newBlog);
    return { id: blogId, ...newBlog };
  } catch (error) {
    console.error('Error adding blog:', error);
    throw error;
  }
};

/**
 * Update an existing blog
 */
export const updateBlog = async (blogId, blogData) => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const blogRef = doc(db, BLOG_COLLECTION, blogId);
    const updateData = {
      ...blogData,
      updatedAt: new Date().toISOString()
    };

    // Use setDoc with merge to update existing or create if not exists
    await setDoc(blogRef, updateData, { merge: true });
    return { id: blogId, ...updateData };
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

/**
 * Delete a blog
 */
export const deleteBlog = async (blogId) => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const blogRef = doc(db, BLOG_COLLECTION, blogId);
    await deleteDoc(blogRef);
    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

/**
 * Increment blog views
 */
export const incrementBlogViews = async (blogId) => {
  try {
    if (!db) return;

    const blogRef = doc(db, BLOG_COLLECTION, blogId);
    const blogSnap = await getDoc(blogRef);

    if (blogSnap.exists()) {
      const currentViews = blogSnap.data().views || 0;
      await updateDoc(blogRef, { views: currentViews + 1 });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
};
