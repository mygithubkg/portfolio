export const projects = [
  {
    id: 'PROJ_01',
    title: 'E-Summit \'25 Official Platform',
    category: 'Web Development',
    year: '2025',
    status: 'DEPLOYED',
    image: '/eic.png', // Ensure this image exists in your /public folder
    description: 'Architected the official website and registration portal for PEC\'s flagship E-Summit, built to serve over 2,000 participants.',
    tech: ['React', 'Node.js', 'Firebase'],
    links: { live: 'https://eicpec.in', code: '' },
    details: 'Engineered a scalable backend with Firebase to manage dynamic event content and user registrations, ensuring high availability during peak traffi.'
  },
  {
    id: 'PROJ_02',
    title: 'AI Summary Pro',
    category: 'GenAI',
    year: '2025',
    status: 'ONLINE',
    image: '/solver.png',
    description: 'Leveraged the Gemini GenAI API to transform vague problem statements into structured, clear outputs.',
    tech: ['Python'], // Added Python icon via mapper
    links: { live: '', code: 'https://github.com/mygithubkg/ai_use_solver' },
    details: 'Developed sophisticated prompt strategies to handle complex input ambiguities, demonstrating deep problem-solving acumen.'
  },
  {
    id: 'PROJ_03',
    title: 'Personal Portfolio',
    category: 'Web Development',
    year: '2025',
    status: 'LIVE',
    image: '/portfolio.png',
    description: 'Designed and developed a modern, fully responsive personal portfolio using React and Tailwind CSS.',
    tech: ['React', 'Tailwind CSS', 'JavaScript'],
    links: { live: 'https://karrtikgupta.vercel.app/', code: 'https://github.com/mygithubkg/portfolio' },
    details: 'Showcases projects, skills, and resume with smooth animations and scroll-based transitions. Integrated dark mode and deployed using Vercel.'
  },
  {
    id: 'PROJ_04',
    title: 'TradeMyTicket',
    category: 'Web Development',
    year: '2024',
    status: 'PROTOTYPE',
    image: '/trade.png',
    description: 'Engineered the backend architecture of a full-stack ticket reselling platform using PostgreSQL for scalable data management.',
    tech: ['React', 'PostgreSQL', 'Node.js', 'Express', 'JavaScript'],
    links: { live: '', code: 'https://github.com/mygithubkg/ticket_reselling' },
    details: 'Implemented secure authentication workflows including user sign-up, login, and session handling. Built auction-style live bidding and instant buy functionality.'
  },
  {
    id: 'PROJ_05',
    title: 'Vehicle & Pedestrian Tracker',
    category: 'Computer Vision',
    year: '2025',
    status: 'RESEARCH',
    image: '/vehicle.png',
    description: 'Engineered a complete computer vision pipeline for real-time object segmentation and tracking using YOLOv8-Seg',
    tech: ['Python'], 
    links: { live: 'https://vehiclehumantracker1234.streamlit.app/', code: 'https://github.com/mygithubkg/Karrtik_Gupta' },
    details: 'Integrates ByteTrack algorithm for persistent multi-object tracking. Demonstrates full MLOps lifecycle from data annotation to deployment.'
  },
  {
    id: 'PROJ_06',
    title: 'Voice-Enabled Commerce',
    category: 'Web Development',
    year: '2024',
    status: 'PROTOTYPE',
    image: '/voice.png',
    description: 'Developed a scalable, voice-interactive shopping prototype to improve accessibility. [cite_start]Integrated Web Speech API.',
    tech: ['React', 'JavaScript'],
    links: { live: '', code: 'https://github.com/mygithubkg/voice-ecommerce' },
    details: 'Allows hands-free navigation and real-time cart updates. Includes PDF invoice generation for completed orders.'
  },
  {
    id: 'PROJ_07',
    title: 'Heart Disease Predictor',
    category: 'Machine Learning',
    year: '2025',
    status: 'ANALYSIS',
    image: '/heart.png',
    description: 'Built a predictive machine learning model to detect the likelihood of heart disease using real-world medical data.',
    tech: ['Python', 'Scikit-learn'],
    links: { live: 'https://github.com/mygithubkg/HeartDiseasePredictor', code: 'https://github.com/mygithubkg/HeartDiseasePredictor' },
    details: 'Applied data preprocessing, feature engineering, and model selection (Logistic Regression, Random Forest, SVM) to reach 85% accuracy.'
  },
  {
    id: 'PROJ_08',
    title: 'Simon Game',
    category: 'Game Development',
    year: '2023',
    status: 'LEGACY',
    image: '/simon.png',
    description: 'Recreated the classic memory-based Simon Game using vanilla JavaScript. Implemented dynamic color patterns.',
    tech: ['JavaScript', 'HTML5', 'CSS3'],
    links: { live: 'https://mygithubkg.github.io/mysimongame/', code: 'https://github.com/mygithubkg/mysimongame' },
    details: 'A fun and challenging browser game that demonstrates core DOM manipulation and event handling skills.'
  }
];
