# Admin Portal Documentation

## Overview
A secure admin portal has been added to manage your portfolio content including projects, about section, services, and contact information.

## Access

### Admin Login
- **URL**: `http://localhost:5173/admin/login` (development) or `https://yourdomain.com/admin/login` (production)
- **Footer Access**: Click the tiny dot (•) below the copyright text in the footer
- **Credentials**: Set in `.env` file

### Environment Setup
1. Check your `.env` file for credentials:
   ```
   VITE_ADMIN_USERNAME=admin
   VITE_ADMIN_PASSWORD=SecureAdmin@2025
   ```
2. **IMPORTANT**: Change the password to something secure!
3. Never commit `.env` to version control (already in `.gitignore`)

## Features

### 1. Projects Management
- **Add Projects**: Create new portfolio projects with all details
- **Edit Projects**: Update existing project information
- **Delete Projects**: Remove projects from your portfolio
- **Project Fields**:
  - Title & Description
  - Live Link & GitHub Link
  - Project Image URL
  - Category (Web Development, ML, etc.)
  - Technologies (comma-separated)
  - Featured flag
  - Year

### 2. Content Management
- **About Section**: Update your bio, skills, and introduction
- **Services**: Add/edit/remove services you offer
- **Contact Info**: Update contact details and availability

### 3. Data Management
- **Export Data**: Download all content as JSON backup
- **Import Data**: Restore from backup file
- **Local Storage**: All data persists in browser's localStorage

## Security Features
- Environment variable authentication
- Session-based login (24-hour expiry)
- Protected routes (auto-redirect if not authenticated)
- Hidden footer access point

## Usage Tips

### Adding a New Project
1. Navigate to Projects tab
2. Click "Add Project"
3. Fill in all required fields (marked with *)
4. For images, use:
   - Public folder: `/project-image.png`
   - External URL: `https://...`
5. Technologies: Enter as comma-separated list (e.g., "React, Node.js, MongoDB")
6. Check "Featured" to highlight on homepage
7. Click "Add Project"

### Managing Content
1. Go to Content tab
2. Select section (About, Services, Contact)
3. Update fields as needed
4. Click "Save" to persist changes

### Backup Your Data
1. Click "Export Data" in sidebar
2. Save the JSON file securely
3. To restore, click "Import Data" and select your backup

## Theme
The admin portal matches your portfolio's theme with:
- Dark mode design
- Accent color highlights
- Smooth animations
- Responsive layout

## Troubleshooting

### Can't Login
- Verify `.env` credentials are correct
- Check that Vite is reading environment variables (should start with `VITE_`)
- Clear browser cache and try again

### Data Not Persisting
- Check browser's localStorage is enabled
- Try exporting and re-importing data
- Verify you're on the same browser/device

### Changes Not Showing on Site
- Currently, admin manages localStorage data
- To integrate with live site, you'll need to:
  1. Update components to read from localStorage
  2. Or integrate with a backend API
  3. Refresh the page after making changes

## Next Steps (Optional Enhancements)
1. **Backend Integration**: Connect to a real database (MongoDB, Firebase, etc.)
2. **Image Upload**: Add image upload functionality instead of URLs
3. **Rich Text Editor**: Use a WYSIWYG editor for descriptions
4. **Multi-Admin**: Support multiple admin users
5. **Analytics**: Add dashboard with portfolio statistics
6. **Email Notifications**: Get notified of new contact form submissions

## Support
For issues or questions about the admin portal, check:
1. Browser console for error messages
2. Network tab for failed requests
3. localStorage data integrity

---

**Security Reminder**: Always keep your admin credentials secure and never share them publicly!
