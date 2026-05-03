# Quick Start Guide - Course Management System

## 🚀 Getting Started

### For Students - Register with Courses

1. **Open Registration Page**: Go to `http://localhost:3000/`
2. **Fill Personal Details**:
   - First Name, Last Name
   - Email, Phone
   - Date of Birth
   - Gender (Male/Female)
   - Address, City
3. **Select Courses**: Scroll down to "Select Courses" section
   - Courses load automatically from database
   - Check boxes next to desired courses
   - See course descriptions for more info
4. **Submit**: Click "Submit Registration"
   - Your registration and selected courses are saved!

---

### For Admins - Manage Courses

#### Access Course Management
- Click **"Admin Dashboard"** or go to `/admin`
- Use navigation bar → Click **"Manage Courses"**
- Or directly visit: `http://localhost:3000/admin/courses`

#### Add a New Course
1. Click **"Add New Course"** button
2. Enter:
   - **Course Code**: Short identifier (e.g., `WEB101`, `DESIGN50`)
   - **Course Name**: Full name (e.g., `Web Development Fundamentals`)
   - **Description**: Details about the course (optional)
3. Click **"Save Course"** button
4. Course appears in list and available for students

#### Edit Existing Course
1. Find course in the list
2. Click **"Edit"** button
3. Modify any details
4. Click **"Save Course"**
5. Changes reflected immediately

#### Delete Course
1. Find course in the list
2. Click **"Delete"** button
3. Confirm deletion in dialog
4. Course removed permanently

#### View Course Statistics
- See **"Total Courses"** card
- Shows number of courses available for registration

---

## 🔧 API Endpoints Reference

### Get All Courses
```bash
curl http://localhost:3000/api/courses
```

### Add New Course
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "course_code": "PYTHON101",
    "course_name": "Python Programming",
    "description": "Learn Python basics"
  }'
```

### Update Course
```bash
curl -X PUT http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "course_code": "PYTHON102",
    "course_name": "Advanced Python",
    "description": "Advanced Python topics"
  }'
```

### Delete Course
```bash
curl -X DELETE http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"id": 1}'
```

---

## 📱 Admin Navigation

From any admin page, use the top navigation bar:

| Link | Page | Purpose |
|------|------|---------|
| Dashboard | `/admin` | View & manage student registrations |
| Manage Courses | `/admin/courses` | Add/edit/delete courses |
| Settings | `/admin/settings` | Configure admin email |
| Export & Email | `/admin/export` | Export data to Excel |

---

## ✅ Validation Rules

### Course Code
- **Required**: Must provide a value
- **Max Length**: 50 characters
- **Unique**: Cannot duplicate existing codes
- **Examples**: `WEB101`, `DESIGN50`, `AI-ML-01`

### Course Name
- **Required**: Must provide a value
- **Max Length**: 255 characters
- **Examples**: `Web Development 101`, `Advanced Python Programming`

### Description
- **Optional**: Can be left blank
- **Max Length**: 1000 characters
- **Examples**: Course overview, learning outcomes, prerequisites

---

## 🎨 Design Features

### Color Scheme
- **Navy Blue** (#1a3a52): Primary navigation and headers
- **Orange** (#ff8c42): Accent colors and highlights
- **Light Gray** (#f8f9fb): Background
- **Dark Text** (#1a3a52): Main content

### Responsive Design
✅ **Mobile** (< 640px) - Single column, stacked layout
✅ **Tablet** (640-1024px) - 2-column layout
✅ **Desktop** (> 1024px) - Full multi-column layout

### Neumorphic UI
- Soft shadows for depth
- Smooth transitions on hover
- Material Design principles
- Accessible form inputs

---

## 🔍 Troubleshooting

### Q: Can't see "Manage Courses" in navigation?
**A**: Make sure you're on an admin page (`/admin/*`). The navigation only appears in admin section.

### Q: New course doesn't show in registration form?
**A**: Refresh the registration page. The form fetches courses when it loads.

### Q: Getting validation error when saving course?
**A**: Check:
- Course Code is not empty
- Course Name is not empty
- Course Code doesn't already exist
- No special characters in Course Code

### Q: Can't delete a course?
**A**: Confirm you clicked the delete button and confirmed in the dialog. It may take a moment to process.

### Q: Courses not loading in registration form?
**A**: Check:
- Admin has created at least one course
- Network tab in browser shows successful API call to `/api/courses`
- No JavaScript errors in console

---

## 📊 Data Model

### Course Object
```json
{
  "id": 1,
  "course_code": "WEB101",
  "course_name": "Web Development Fundamentals",
  "description": "Learn HTML, CSS, and JavaScript",
  "created_at": "2026-05-03T10:00:00Z",
  "updated_at": "2026-05-03T10:00:00Z"
}
```

### Student Registration with Courses
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "date_of_birth": "2000-01-15",
  "gender": "male",
  "address": "123 Main St",
  "city": "New York",
  "courses": ["1", "3", "5"],
  "created_at": "2026-05-03T10:05:00Z",
  "updated_at": "2026-05-03T10:05:00Z"
}
```

---

## 🎯 Common Tasks

### Add 5 Sample Courses
1. Go to `/admin/courses`
2. Add courses:
   - `WEB101` - Web Development Fundamentals
   - `DESIGN50` - Graphic Design Basics
   - `PYTHON101` - Python Programming
   - `MOBILE50` - Mobile App Development
   - `DATA100` - Data Science Introduction

### Update Course Details
1. Find course in list
2. Click Edit
3. Change Course Name or Description
4. Click Save

### Remove Outdated Course
1. Find course in list
2. Click Delete
3. Confirm deletion

### View Admin Stats
- Top of page shows total courses available
- Shows "Available for Registration" count

---

## 🚨 Important Notes

### For Production Use
- Implement proper authentication
- Add role-based access control
- Enable audit logging
- Use HTTPS only
- Implement rate limiting
- Add backup strategy

### Data Integrity
- Course codes are unique
- Deleting a course doesn't delete student registrations
- Course IDs stored in registrations remain valid
- Timestamps track creation and updates

### Performance
- Courses cached for 60 seconds
- Efficient database queries with indexes
- Lazy loading of large datasets
- Optimized for mobile networks

---

## 📞 Support

For issues or feature requests:
1. Check browser console for errors
2. Review validation error messages
3. Verify database connection
4. Check API endpoints are responding

---

**Ready to manage courses? Visit `/admin/courses` now! 🎓**
