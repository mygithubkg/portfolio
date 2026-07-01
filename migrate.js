const fs = require('fs');
const path = require('path');

const OLD_SRC = path.join(__dirname, '../old_website/src');
const NEW_SRC = path.join(__dirname);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyAndTransform(sourceFile, destFile, isPage = false) {
  if (!fs.existsSync(sourceFile)) {
    console.warn(`Source file not found: ${sourceFile}`);
    return;
  }
  
  let content = fs.readFileSync(sourceFile, 'utf8');
  
  // 1. Add "use client" if it's a client component or page
  if (content.includes('useState') || content.includes('useEffect') || content.includes('framer-motion') || isPage) {
    if (!content.startsWith('"use client"')) {
      content = `"use client";\n` + content;
    }
  }

  // 2. Replace React Router imports
  content = content.replace(/import\s+\{\s*Link([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, "import Link from 'next/link';\nimport { $1 } from 'next/navigation';");
  content = content.replace(/import\s+\{\s*useNavigate([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, "import { useRouter$1 } from 'next/navigation';");
  content = content.replace(/useNavigate/g, "useRouter");
  content = content.replace(/import\s+\{\s*useParams([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, "import { useParams$1 } from 'next/navigation';");
  
  // Replace <Link to="..."> with <Link href="...">
  content = content.replace(/<Link([^>]+)to=/g, "<Link$1href=");

  // 3. Replace utility/context/firebase imports
  content = content.replace(/from\s+['"]\.\.\/utils\//g, "from '@/lib/utils/");
  content = content.replace(/from\s+['"]\.\.\/\.\.\/utils\//g, "from '@/lib/utils/");
  content = content.replace(/from\s+['"]\.\.\/config\/firebase['"]/g, "from '@/lib/firebase'");
  content = content.replace(/from\s+['"]\.\.\/\.\.\/config\/firebase['"]/g, "from '@/lib/firebase'");
  content = content.replace(/from\s+['"]\.\.\/context\//g, "from '@/context/");
  content = content.replace(/from\s+['"]\.\.\/\.\.\/context\//g, "from '@/context/");
  content = content.replace(/from\s+['"]\.\.\/hooks\//g, "from '@/lib/hooks/");
  content = content.replace(/from\s+['"]\.\.\/\.\.\/hooks\//g, "from '@/lib/hooks/");
  content = content.replace(/from\s+['"]\.\.\/Components\//g, "from '@/components/");
  
  // Also handle exact paths for ui components if any
  content = content.replace(/from\s+['"]\.\/ui\//g, "from '@/components/ui/");
  content = content.replace(/from\s+['"]\.\.\/ui\//g, "from '@/components/ui/");

  // 4. Update import.meta.env to process.env
  content = content.replace(/import\.meta\.env\.VITE_/g, "process.env.NEXT_PUBLIC_");
  content = content.replace(/import\.meta\.env\.MODE/g, "process.env.NODE_ENV");

  ensureDir(path.dirname(destFile));
  fs.writeFileSync(destFile, content);
  console.log(`Migrated: ${path.basename(destFile)}`);
}

// Admin Components
const adminComponents = [
  'BlogManager', 'ContentManager', 'ProjectsManager', 
  'ResetToDefaultModal', 'SocialsManager', 'TechStackManager', 'TimelineManager'
];

adminComponents.forEach(comp => {
  copyAndTransform(
    path.join(OLD_SRC, `Components/Admin/${comp}.jsx`),
    path.join(NEW_SRC, `components/Admin/${comp}.tsx`)
  );
});

// Pages -> Next.js app directory
const pages = [
  { old: 'Components/Home.jsx', new: 'app/page.tsx' },
  { old: 'Components/About.jsx', new: 'app/about/page.tsx' },
  { old: 'Components/Services.jsx', new: 'app/services/page.tsx' },
  { old: 'Components/Projects.jsx', new: 'app/projects/page.tsx' },
  { old: 'Components/Blog.jsx', new: 'app/blog/page.tsx' },
  { old: 'Pages/BlogDetailPage.jsx', new: 'app/blog/[id]/page.tsx' },
  { old: 'Components/Contact.jsx', new: 'app/contact/page.tsx' },
  { old: 'Pages/AdminLogin.jsx', new: 'app/admin/login/page.tsx' },
  { old: 'Pages/AdminDashboard.jsx', new: 'app/admin/dashboard/page.tsx' }
];

pages.forEach(page => {
  copyAndTransform(
    path.join(OLD_SRC, page.old),
    path.join(NEW_SRC, page.new),
    true // isPage
  );
});

console.log('Migration script complete!');
