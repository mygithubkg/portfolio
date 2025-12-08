import { FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { SiFirebase, SiJavascript, SiScikitlearn, SiTailwindcss, SiPostgresql, SiNodedotjs, SiExpress } from 'react-icons/si';

// Technology icon mapping - returns React components
export const getTechIcon = (techName, index = 0) => {
  const iconMap = {
    'React': <FaReact key={`react-${index}`} />,
    'Node.js': <SiNodedotjs key={`node-${index}`} />,
    'Firebase': <SiFirebase key={`firebase-${index}`} />,
    'Python': <FaPython key={`python-${index}`} />,
    'JavaScript': <SiJavascript key={`js-${index}`} />,
    'Tailwind CSS': <SiTailwindcss key={`tailwind-${index}`} />,
    'PostgreSQL': <SiPostgresql key={`postgresql-${index}`} />,
    'Express': <SiExpress key={`express-${index}`} />,
    'Scikit-learn': <SiScikitlearn key={`sklearn-${index}`} />,
    'HTML5': <FaHtml5 key={`html-${index}`} />,
    'CSS3': <FaCss3Alt key={`css-${index}`} />
  };
  
  return iconMap[techName] || null;
};
