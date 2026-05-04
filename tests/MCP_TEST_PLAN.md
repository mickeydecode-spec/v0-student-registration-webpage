# Minimum Critical Paths (MCP) Test Plan
## Dream More Training Center Website

### Overview
This document defines the Minimum Critical Paths for testing the Dream More website.
MCPs represent the essential user journeys that must function correctly for the site to be considered operational.

---

## MCP 1: Homepage Load and Navigation
**Priority:** Critical
**Description:** Verify homepage loads correctly with all essential elements

### Test Steps:
1. Navigate to homepage (/)
2. Verify page title contains "Dream More"
3. Verify logo is visible
4. Verify navigation elements are present
5. Verify registration form section is visible
6. Verify footer with contact information is present

### Success Criteria:
- Page loads within 3 seconds
- All sections render without errors
- Logo and branding are visible
- Contact numbers (+251 99 313 2122) are displayed
- Copyright year shows 2026

---

## MCP 2: Student Registration Flow
**Priority:** Critical
**Description:** Complete student registration with multi-course selection

### Test Steps:
1. Navigate to homepage
2. Fill in personal details (first name, last name)
3. Enter email address
4. Enter phone number (with +251 prefix)
5. Select date of birth
6. Select gender
7. Enter address and city
8. Select multiple courses using checkbox cards
9. Verify course selection counter updates
10. Submit registration form
11. Verify success message

### Success Criteria:
- All form fields accept input correctly
- Phone prefix (+251) is pre-filled
- Course cards are interactive and selectable
- Multiple courses can be selected
- Selection counter shows correct count
- Form submission succeeds
- Success toast notification appears

---

## MCP 3: Admin Login Flow
**Priority:** Critical
**Description:** Verify admin authentication works correctly

### Test Steps:
1. Navigate to /admin/login
2. Verify login form is displayed
3. Enter admin password
4. Click login button
5. Verify redirect to admin dashboard
6. Verify session persists on page refresh

### Success Criteria:
- Login page renders correctly
- Password field accepts input
- Invalid password shows error message
- Valid password redirects to dashboard
- No manual page refresh required
- Session persists across navigation

---

## MCP 4: Admin Dashboard Overview
**Priority:** High
**Description:** Verify admin dashboard displays correct statistics

### Test Steps:
1. Login as admin
2. Navigate to /admin (dashboard)
3. Verify statistics cards are displayed
4. Verify recent registrations list
5. Verify navigation sidebar works
6. Verify refresh button functions

### Success Criteria:
- Dashboard loads without errors
- Statistics cards show data
- Navigation items are clickable
- Refresh button updates data
- Logout button works

---

## MCP 5: Course Management
**Priority:** High
**Description:** Verify course CRUD operations

### Test Steps:
1. Login as admin
2. Navigate to /admin/manage-courses
3. View existing courses list
4. Add a new course
5. Edit an existing course
6. Delete a course
7. Verify changes persist

### Success Criteria:
- Course list displays correctly
- Add course form works
- Edit functionality updates course
- Delete removes course from list
- Changes reflect in database

---

## MCP 6: Registration Data Management
**Priority:** High
**Description:** Verify admin can view and manage registrations

### Test Steps:
1. Login as admin
2. Navigate to /admin/registrations
3. View list of registered students
4. Filter/search registrations
5. View individual registration details
6. Verify course enrollment displays correctly

### Success Criteria:
- Registration list loads
- Multiple courses per student display correctly
- Search/filter functions work
- Data is accurate and complete

---

## MCP 7: Data Export Functionality
**Priority:** Medium
**Description:** Verify Excel export works correctly

### Test Steps:
1. Login as admin
2. Navigate to /admin/export
3. View export options
4. Click "Download Excel" button
5. Verify file downloads
6. Test email export option

### Success Criteria:
- Export page loads correctly
- Excel file generates and downloads
- File contains correct data
- Email export sends successfully

---

## MCP 8: Responsive Design
**Priority:** Medium
**Description:** Verify site works on different screen sizes

### Test Steps:
1. Test on desktop (1920x1080)
2. Test on tablet (768x1024)
3. Test on mobile (375x667)
4. Verify navigation adapts
5. Verify forms are usable on all sizes
6. Verify course cards grid adapts

### Success Criteria:
- No horizontal scrolling on mobile
- Navigation collapses on mobile
- Forms are fully functional on all devices
- Course cards stack appropriately
- Touch targets are adequate size

---

## MCP 9: API Endpoints
**Priority:** High
**Description:** Verify API endpoints function correctly

### Test Steps:
1. Test GET /api/courses
2. Test POST /api/courses
3. Test GET /api/registrations
4. Test POST /api/send-email

### Success Criteria:
- All endpoints return correct status codes
- Response data is properly formatted
- Error handling works correctly
- Authentication is enforced where needed

---

## MCP 10: Error Handling
**Priority:** Medium
**Description:** Verify error states are handled gracefully

### Test Steps:
1. Submit form with missing required fields
2. Enter invalid email format
3. Try to login with wrong password
4. Test 404 page
5. Test network error handling

### Success Criteria:
- Validation errors display clearly
- User-friendly error messages
- Form prevents submission when invalid
- Network errors show appropriate message

---

## Test Execution Summary Template

| MCP | Test Name | Status | Duration | Notes |
|-----|-----------|--------|----------|-------|
| 1 | Homepage Load | | | |
| 2 | Student Registration | | | |
| 3 | Admin Login | | | |
| 4 | Admin Dashboard | | | |
| 5 | Course Management | | | |
| 6 | Registration Data | | | |
| 7 | Data Export | | | |
| 8 | Responsive Design | | | |
| 9 | API Endpoints | | | |
| 10 | Error Handling | | | |

---

## Environment Details
- **Framework:** Next.js 16
- **Database:** Supabase
- **Styling:** Tailwind CSS v4
- **Test Browser:** Chromium (via agent-browser)
