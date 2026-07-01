# Admin Portal Logic & Code Architecture

This document explains the underlying logic, data flow, and code structure of the Admin Portal in the portfolio application. The admin panel comprises various managers (`ProjectsManager`, `ContentManager`, `BlogManager`) that share a unified architectural pattern.

## 1. Authentication & Security
The admin portal is protected by an authentication context to prevent unauthorized access.
- **Context Hook:** `useAdminAuth()` provides `isAuthenticated` and `logout` functionality.
- **Route Protection:** Components use a `useEffect` hook to redirect unauthenticated users to the `/admin/login` page immediately.
- **Security Utilities:** Sensitive operations rely on a `@/lib/utils/security` package. 
  - `auditLog()`: Tracks and logs significant events (e.g., `PROJECT_ADDED_LIVE`, `VALIDATION_FAILED`).
  - `handleSecureError()`: Safely processes error messages without exposing sensitive stack traces.
  - **Validation:** Data validation leverages standard schemas (e.g., `projectSchema` with `validateData()`) to ensure no malformed data reaches the database.

## 2. Dual Data Modes (Live vs. Defaults)
A fundamental feature of the admin portal is the ability to toggle between two data sources:
- **Live Data:** The data currently fetched and visible to public visitors on the website.
- **Defaults Data:** A sandbox/template dataset used for staging, or serving as a fallback state.
- **Implementation:** A state variable `const [mode, setMode] = useState('live')` controls the UI. Every read/write/delete operation checks this `mode` to determine whether to call the standard API functions or the "Default" API functions.

## 3. Data Flow Operations (CRUD)

### Read Operations
Data fetching occurs when the component mounts or whenever the `mode` toggles.
- **Example Logic:**
```typescript
const loadProjects = async () => {
  try {
    const data = mode === 'live' ? await getProjects() : await getDefaultProjects();
    setProjects(data);
  } catch (error) {
    // Handle error
  }
};
```

### Create (Write) & Update Logic
All creations and updates are handled by a single modal form that utilizes a unified `formData` state. The `handleSubmit` function manages the process:
1. **Formatting:** Raw inputs (like comma-separated strings for technologies or hashtags) are parsed into arrays.
2. **Validation:** The data is validated against a schema before proceeding.
3. **API Routing:** The logic checks if an item is being edited (e.g., `editingProject` is populated) and routes the API call based on the `mode`:
```typescript
if (editingProject) {
  // Update Logic
  if (mode === 'live') {
    await updateProject(editingProject.id, validation.data);
  } else {
    await updateDefaultProject(editingProject.id, validation.data);
  }
} else {
  // Create Logic
  if (mode === 'live') {
    await addProject(validation.data);
  } else {
    await addDefaultProject(validation.data);
  }
}
```
4. **Post-Action:** Upon success, the data is re-fetched to reflect the new state, the modal is closed, and form states are cleared. An `isSubmitting` flag is used to prevent duplicate requests.

### Delete Logic
Deletion is strictly guarded by a two-step confirmation process to prevent accidental data loss.
- **Confirmation Modal:** Prompts the user to confirm deletion. For highly sensitive data (like Projects), the user must explicitly type "DELETE" into an input field to enable the confirm button.
- **API Call:** The `deleteProject(id)` or `deleteDefaultProject(id)` function is invoked depending on the active `mode`.

### Reset to Default Logic
To allow quick recovery or standardization, a "Reset to Defaults" feature exists across managers.
- **Functionality:** `resetSectionToDefault('section_name')` completely overwrites the Live data collection for that specific section with the data currently held in the Defaults collection.

## 4. Reusable UI Architecture
The UI is constructed to be highly reusable, ensuring code DRYness while maintaining a consistent aesthetic.
- **Input Components:** A reusable `<TechInput />` component manages text, textareas, and select inputs. It standardizes styling, animations, labels, and focus states.
- **Animations:** `framer-motion` (`<AnimatePresence>`, `<motion.div>`) is heavily utilized for smooth mounting/unmounting transitions of grid lists, modals, and status notifications.
- **Feedback Mechanisms:** Status notifications, success messages, and validation errors are managed in local state and automatically cleared using `setTimeout` for a clean user experience.
