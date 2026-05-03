# Course Management System - Documentation

## Overview

A comprehensive course management system integrated into the Dream More Student Registration platform. Admins can now add, edit, and remove courses dynamically, which are immediately available for student registration.

## Features

### 1. Course Management Interface (`/admin/courses`)

**Main Features:**
- ✅ Add new courses with course code, name, and description
- ✅ Edit existing courses in-place
- ✅ Delete courses with confirmation dialog
- ✅ Real-time course list display with statistics
- ✅ Form validation with error messages
- ✅ Responsive design for desktop and mobile

**Course Information:**
- **Course Code** (Required): Unique identifier for the course (e.g., CS101, WEB201)
- **Course Name** (Required): Full name of the course
- **Description** (Optional): Detailed course description

### 2. Dynamic Course Loading

**Student Registration Form:**
- Courses are fetched dynamically from the database via `/api/courses`
- Loading state shown while fetching courses
- Displays course names and descriptions for better student clarity
- Students can select multiple courses during registration
- Selected courses are stored as course IDs in the database

### 3. Database Schema

```sql
CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  course_code VARCHAR(50) UNIQUE NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. API Endpoints

**GET `/api/courses`**
- Retrieves all courses ordered by creation date
- Returns: Array of course objects

**POST `/api/courses`**
- Creates a new course
- Request body: `{ course_code, course_name, description? }`
- Validates required fields
- Returns: Created course object

**PUT `/api/courses`**
- Updates an existing course
- Request body: `{ id, course_code, course_name, description? }`
- Returns: Updated course object

**DELETE `/api/courses`**
- Deletes a course
- Request body: `{ id }`
- Returns: Success status

### 5. Admin Navigation

New unified admin navigation bar (`AdminNav`) provides quick access to:
- Dashboard - View and manage registrations
- Manage Courses - Add/edit/delete courses
- Settings - Configure admin email
- Export & Email - Export registration data

**Available on all admin pages:**
- `/admin`
- `/admin/courses`
- `/admin/settings`
- `/admin/export`

### 6. UI Components

#### CourseManagement Component
Located: `/components/course-management.tsx`

**Features:**
- Two-column layout on desktop (form on left, list on right)
- Single-column responsive layout on mobile
- Color-coded course codes with accent styling
- Inline edit/delete buttons
- Statistics dashboard showing total courses
- Form validation with error indicators
- Loading states and empty states

**Form Validation:**
- Course Code: Required, max 50 characters
- Course Name: Required, max 255 characters
- Description: Optional, max 1000 characters
- Duplicate course code detection (database level)

#### Form Components Used:
- Input fields with neumorphic styling
- Textarea for descriptions with character counter
- Alert icons for validation errors
- Loading spinner during save
- Action buttons (Save, Cancel, Add New, Edit, Delete)

### 7. Usage Flow

**For Admins:**

1. Navigate to `/admin/courses`
2. Click "Add New Course" button
3. Fill in course details:
   - Course Code (e.g., "WEBDEV101")
   - Course Name (e.g., "Web Development Fundamentals")
   - Description (optional)
4. Click "Save Course"
5. View course in the list
6. Edit: Click "Edit" button, modify details, click "Save"
7. Delete: Click "Delete" button, confirm in dialog

**For Students:**

1. Go to registration form (`/`)
2. Scroll to "Select Courses" section
3. Courses load dynamically from database
4. Check boxes to select desired courses
5. Submit registration
6. Selected courses are saved with registration

### 8. Data Flow

```
Admin adds course
    ↓
POST /api/courses
    ↓
Course saved to Supabase
    ↓
GET /api/courses returns updated list
    ↓
Course appears in student registration form
    ↓
Student selects courses
    ↓
Course IDs stored with registration
```

### 9. Error Handling

- Server-side validation on all endpoints
- Client-side form validation with feedback
- Duplicate course code prevention
- Confirmation dialogs for destructive actions
- Toast notifications for success/error states
- Graceful fallback when courses fail to load

### 10. Performance Optimizations

- SWR caching for course list
- Database indexes on course_code and course_name
- Debounced form field validation
- Lazy loading of courses in registration form
- Efficient list rendering with proper keys

### 11. Styling & Theming

**Applied Styles:**
- Dream More brand colors (Navy Blue #1a3a52, Orange #ff8c42)
- Neumorphic soft UI shadows
- Material Design elevation effects
- Responsive grid layouts
- Smooth transitions and hover states
- Accessible form inputs

### 12. Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-responsive design
- Touch-friendly buttons and inputs
- Responsive typography

### 13. File Structure

```
/app/
  /admin/
    /courses/
      page.tsx                 # Courses management page
    /settings/
      page.tsx                 # Updated with AdminNav
    /export/
      page.tsx                 # Updated with AdminNav
    page.tsx                   # Updated with AdminNav

/components/
  admin-nav.tsx               # Admin navigation component
  course-management.tsx       # Course management UI
  student-registration-form.tsx # Updated to use dynamic courses

/app/api/
  /courses/
    route.ts                  # Course CRUD endpoints

/hooks/
  use-courses.ts              # SWR hook for course data
```

## Integration with Existing System

### Student Registration Flow

1. When student opens registration form
2. useEffect fetches courses from `/api/courses`
3. Courses display in grid with checkboxes
4. Student selects courses by course ID
5. Form submission includes course IDs array
6. Registration stored with course selections
7. Admin can view courses in registration details

### Admin Dashboard

- Can see which courses students registered for
- Course IDs displayed in registration details
- Can manage courses separately in `/admin/courses`

## Future Enhancements

- Course prerequisites and dependencies
- Course capacity and enrollment limits
- Course categories/streams
- Bulk import/export courses
- Course scheduling and timings
- Course instructors assignment
- Course fees and payment integration

## Troubleshooting

**Courses not loading?**
- Check API endpoint `/api/courses`
- Verify Supabase connection
- Check browser console for errors

**Cannot save course?**
- Verify all required fields are filled
- Check for duplicate course code
- Ensure no special characters in course code

**Courses not appearing in registration?**
- Clear browser cache
- Refresh the page
- Check if courses are properly saved in database

## Security Notes

- RLS policies allow public read/write (suitable for demo)
- Consider implementing proper authentication for production
- Add role-based access control for admin functions
- Implement audit logging for course changes
