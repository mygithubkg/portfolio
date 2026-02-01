import * as yup from 'yup';

// ============================================
// PROJECT VALIDATION SCHEMA
// ============================================

export const projectSchema = yup.object().shape({
  title: yup
    .string()
    .required('Project title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  
  details: yup
    .string()
    .max(5000, 'Details must not exceed 5000 characters')
    .trim(),
  
  link: yup
    .string()
    .url('Live URL must be a valid URL')
    .nullable()
    .transform((value) => value || null),
  
  github: yup
    .string()
    .url('GitHub URL must be a valid URL')
    .nullable()
    .transform((value) => value || null),
  
  image: yup
    .string()
    .nullable()
    .test('is-valid-url-or-path', 'Image must be a valid URL or path', (value) => {
      if (!value) return true; // Allow empty
      // Check if it's a URL
      try {
        new URL(value);
        return true;
      } catch {
        // Check if it's a relative path
        return value.startsWith('/') || value.startsWith('./') || value.startsWith('../');
      }
    }),
  
  category: yup
    .string()
    .required('Category is required')
    .oneOf(
      ['Web Development', 'Mobile App', 'AI/ML', 'Desktop App', 'Game Development', 'Other'],
      'Invalid category selected'
    ),
  
  tech: yup
    .array()
    .of(yup.string().trim())
    .min(1, 'At least one technology is required')
    .max(20, 'Maximum 20 technologies allowed'),
  
  featured: yup
    .boolean()
    .default(false),
  
  year: yup
    .number()
    .required('Year is required')
    .integer('Year must be a whole number')
    .min(2000, 'Year must be 2000 or later')
    .max(new Date().getFullYear() + 5, `Year cannot be more than ${new Date().getFullYear() + 5}`)
    .typeError('Year must be a valid number')
});

// ============================================
// BLOG VALIDATION SCHEMA
// ============================================

export const blogSchema = yup.object().shape({
  title: yup
    .string()
    .required('Blog title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  
  excerpt: yup
    .string()
    .required('Excerpt is required')
    .min(20, 'Excerpt must be at least 20 characters')
    .max(500, 'Excerpt must not exceed 500 characters')
    .trim(),
  
  content: yup
    .string()
    .required('Content is required')
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content must not exceed 50000 characters'),
  
  image: yup
    .string()
    .nullable()
    .test('is-valid-url-or-path', 'Image must be a valid URL or path', (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return value.startsWith('/') || value.startsWith('./') || value.startsWith('../');
      }
    }),
  
  category: yup
    .string()
    .required('Category is required')
    .max(50, 'Category must not exceed 50 characters')
    .trim(),
  
  tags: yup
    .array()
    .of(yup.string().trim())
    .max(10, 'Maximum 10 tags allowed'),
  
  readTime: yup
    .string()
    .required('Read time is required')
    .matches(/^\d+\s*min(s)?$/, 'Read time must be in format "5 min" or "5 mins"'),
  
  date: yup
    .string()
    .required('Date is required')
});

// ============================================
// CONTACT VALIDATION SCHEMA
// ============================================

export const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters')
    .trim()
    .lowercase(),
  
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters')
    .trim()
});

// ============================================
// ABOUT VALIDATION SCHEMA
// ============================================

export const aboutSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  
  subtitle: yup
    .string()
    .max(200, 'Subtitle must not exceed 200 characters')
    .trim(),
  
  bio: yup
    .string()
    .max(2000, 'Bio must not exceed 2000 characters')
    .trim(),
  
  skills: yup
    .array()
    .of(yup.string().trim())
    .max(50, 'Maximum 50 skills allowed')
});

// ============================================
// VALIDATION HELPER FUNCTIONS
// ============================================

/**
 * Validate data against a schema and return errors
 * @param {Object} data - Data to validate
 * @param {yup.Schema} schema - Yup schema to validate against
 * @returns {Object} - { isValid: boolean, errors: Object, data: Object }
 */
export const validateData = async (data, schema) => {
  try {
    const validatedData = await schema.validate(data, { abortEarly: false });
    return {
      isValid: true,
      errors: {},
      data: validatedData
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return {
        isValid: false,
        errors,
        data: null
      };
    }
    throw error;
  }
};

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field
 * @param {any} value - Value to validate
 * @param {yup.Schema} schema - Schema containing the field
 * @returns {Object} - { isValid: boolean, error: string|null }
 */
export const validateField = async (fieldName, value, schema) => {
  try {
    await yup.reach(schema, fieldName).validate(value);
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { isValid: false, error: error.message };
    }
    throw error;
  }
};

/**
 * Get field validation schema
 * @param {yup.Schema} schema - Full schema
 * @param {string} fieldName - Field name
 * @returns {yup.Schema} - Field schema
 */
export const getFieldSchema = (schema, fieldName) => {
  return yup.reach(schema, fieldName);
};
