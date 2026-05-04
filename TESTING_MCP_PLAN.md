# Comprehensive Testing Plan - Minimum Critical Paths (MCPs)

## Overview
This document outlines the critical user journeys and workflows that must be tested to validate core functionality, performance, and user experience of the Dream More application.

## MCP 1: Student Registration - Basic Single Page Form
**Objective:** Validate student registration on homepage with multi-course selection

**Path:** Home Page → Fill Registration Form → Select Multiple Courses → Submit → Success

**Steps:**
1. Navigate to http://localhost:3000
2. Verify homepage loads completely (logo, header, footer visible)
3. Scroll to "Select Your Courses" section
4. Verify course cards display with descriptions
5. Select 2-3 courses by clicking on cards
6. Verify selection counter updates
7. Fill all required fields:
   - First Name: "Ahmed"
   - Last Name: "Hassan"
   - Email: "ahmed@example.com"
   - Phone: "912345678"
   - Date of Birth: "1990-01-15"
   - Gender: "Male"
   - Address: "Addis Ababa"
   - City: "Addis Ababa"
8. Click Submit button
9. Verify success message: "Registration completed successfully!"
10. Verify form clears for new submission
11. Verify data saved in database

**Expected Results:**
- Form loads without errors
- Course cards are clickable and show visual feedback
- Selection counter displays correctly
- Form submits successfully with multiple courses
- Success toast appears
- Database contains course array: [1, 2, 3]

**Acceptance Criteria:**
- ✓ All form fields accept input
- ✓ Multi-course selection works
- ✓ Validation works (required fields)
- ✓ Submission succeeds
- ✓ Data persists in database

---

## MCP 2: Form Validation - Error Handling
**Objective:** Verify comprehensive form validation

**Path:** Home Page → Try Invalid Submissions → Verify Error Messages

**Steps:**
1. Navigate to homepage
2. Try to submit form without selecting courses
3. Verify error: "Please select at least one course"
4. Submit form with empty first name
5. Verify error: "First name is required"
6. Submit form with invalid email (no @)
7. Verify error: "Valid email is required"
8. Submit form with empty phone
9. Verify error: "Phone number is required"
10. Submit form with empty date of birth
11. Verify error: "Date of birth is required"
12. Submit form with no gender selected
13. Verify error: "Gender is required"

**Expected Results:**
- Each field validates properly
- Error messages are clear and helpful
- User cannot submit incomplete form
- Error messages appear as toast notifications
- Form remains populated after validation error

**Acceptance Criteria:**
- ✓ All required field validations work
- ✓ Email format validation works
- ✓ At least 1 course validation works
- ✓ Error messages are user-friendly

---

## MCP 3: Admin Login - Access Control
**Objective:** Verify admin authentication and session management

**Path:** Admin Login → Enter Password → Access Dashboard → Verify Session → Logout

**Steps:**
1. Navigate to http://localhost:3000/admin/login
2. Verify login page displays
3. Enter correct admin password
4. Click Login button
5. Verify automatic redirect to /admin dashboard (no page refresh needed)
6. Verify dashboard displays with admin content
7. Refresh page with F5
8. Verify still logged in (session persists)
9. Navigate to /admin/registrations
10. Verify page loads (protected route works)
11. Click Logout button
12. Verify redirect to login page
13. Try to access /admin directly
14. Verify redirects back to login

**Expected Results:**
- Login page accessible
- Correct password allows access
- Automatic redirect after login
- Session persists across page refreshes
- Logout clears session
- Protected routes require authentication

**Acceptance Criteria:**
- ✓ Login works with correct password
- ✓ Login fails with incorrect password
- ✓ Automatic redirect after login
- ✓ Session persists (no refresh required)
- ✓ Logout works properly
- ✓ Protected routes enforce authentication

---

## MCP 4: Admin Dashboard - Data Display
**Objective:** Verify admin dashboard displays registration data correctly

**Path:** Login → Dashboard → View Registrations → Verify Data Display

**Steps:**
1. Login to admin panel
2. Verify dashboard loads
3. Check dashboard displays correct sections
4. Click on "Registrations" in sidebar
5. Verify registrations table loads with data
6. Check if previously submitted registration appears
7. Verify course data shows as array or formatted list
8. Verify phone shows with +251 prefix
9. Check pagination if many records
10. Verify all columns display correctly

**Expected Results:**
- Dashboard loads successfully
- Registrations page displays table
- Data from previous tests appears
- Courses show correctly (multiple courses)
- Phone format correct (+251)
- Table is responsive

**Acceptance Criteria:**
- ✓ Dashboard renders without errors
- ✓ Data displays correctly
- ✓ Multi-course data is visible
- ✓ Table is organized and readable

---

## MCP 5: Admin Refresh Data - Functionality
**Objective:** Verify refresh button updates data in real-time

**Path:** Admin Dashboard → Click Refresh → Verify Data Updates

**Steps:**
1. Login to admin panel
2. Note current number of registrations
3. Open new browser tab and submit registration on homepage
4. Return to admin panel (don't refresh page)
5. Click "Refresh Data" button in top bar
6. Verify button shows loading state (spinning icon)
7. Verify new registration appears in table
8. Verify course data from new registration is correct

**Expected Results:**
- Refresh button is visible and accessible
- Refresh button shows loading animation
- New data appears after refresh
- No page reload needed
- Course data updated correctly

**Acceptance Criteria:**
- ✓ Refresh button is clickable
- ✓ Loading state displays
- ✓ Data updates without page refresh
- ✓ New registrations appear

---

## MCP 6: Admin Course Management - CRUD Operations
**Objective:** Verify ability to manage courses

**Path:** Admin → Manage Courses → Add Course → Edit Course → View in Registration

**Steps:**
1. Login to admin panel
2. Click "Manage Courses" in sidebar
3. Verify courses list displays
4. Verify current courses show correct data
5. Try adding a new course (if applicable)
6. Verify new course appears in homepage dropdown/cards
7. Register with new course
8. Verify new course selection saved

**Expected Results:**
- Course management page accessible
- Courses display correctly
- Courses available for registration
- New courses appear immediately

**Acceptance Criteria:**
- ✓ Course management page loads
- ✓ Courses display
- ✓ New courses available for selection

---

## MCP 7: Admin Export - Data Download
**Objective:** Verify Excel export functionality

**Path:** Admin → Export Data → Select Courses → Download Excel → Verify Content

**Steps:**
1. Login to admin panel
2. Click "Export Data" in sidebar
3. Verify export page loads
4. See option to download Excel
5. Click "Download Excel" button
6. Verify file downloads (check Downloads folder)
7. Open Excel file
8. Verify columns: Name, Email, Phone, Courses, etc.
9. Verify data from previous registrations appears
10. Verify course data shows as course IDs or names
11. Verify phone has +251 prefix

**Expected Results:**
- Export page accessible
- Download button works
- Excel file generates with proper format
- Data includes all registrations
- Phone format correct
- Course data included

**Acceptance Criteria:**
- ✓ Export page loads
- ✓ Excel file downloads
- ✓ File contains correct data
- ✓ Format is readable

---

## MCP 8: Mobile Responsiveness - Homepage
**Objective:** Verify responsive design on mobile devices

**Path:** Access Homepage on Mobile → Verify Layout → Test Interactions → Submit Form

**Device Sizes:**
- iPhone 12 (390x844)
- iPad (768x1024)
- Desktop (1920x1080)

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar
3. Select iPhone 12
4. Verify header responsive
5. Verify logo displays
6. Verify menu is hamburger on mobile
7. Scroll to course selection
8. Verify course cards stack in single column
9. Verify checkboxes are touch-friendly
10. Verify buttons are clickable
11. Fill form fields on mobile
12. Verify form inputs are accessible
13. Submit form on mobile
14. Verify success message displays
15. Test on tablet (768px)
16. Verify 2-column layout
17. Test on desktop (1920px)
18. Verify 3-column layout

**Expected Results:**
- Mobile: Single column, hamburger menu, touch-friendly
- Tablet: Two-column layout, good spacing
- Desktop: Three-column layout, full width
- All form interactions work on all sizes
- Text is readable on all sizes
- No horizontal scroll

**Acceptance Criteria:**
- ✓ Mobile layout is single column
- ✓ Tablet layout is two columns
- ✓ Desktop layout is three columns
- ✓ All interactions work on mobile
- ✓ No layout breaks

---

## MCP 9: Phone Input - Formatting
**Objective:** Verify phone input displays prefix correctly

**Path:** Homepage → Phone Input → Verify +251 Prefix → Submit → Verify in DB

**Steps:**
1. Navigate to homepage
2. Scroll to phone field
3. Verify "+251" prefix displays as non-editable label
4. Enter phone number: "912345678"
5. Verify display shows "+251" prefix
6. Submit form
7. Check database for phone format
8. Verify phone stored as "+251 912345678"

**Expected Results:**
- Phone field shows +251 prefix
- Prefix is not editable
- Phone number input accepts only digits
- Phone formatted correctly in database
- Display shows +251 912345678

**Acceptance Criteria:**
- ✓ Phone prefix displays
- ✓ Phone formats correctly
- ✓ Database stores complete number

---

## MCP 10: Navigation - All Pages
**Objective:** Verify navigation between all pages works

**Path:** Homepage → Register → Admin → Manage Courses → Export → Settings → Logout

**Steps:**
1. Start at http://localhost:3000
2. Click links to navigate around site
3. Access /register page
4. Verify page loads
5. Access /admin
6. Verify redirects to /admin/login (not authenticated)
7. Login to admin
8. Verify /admin/registrations loads
9. Verify /admin/manage-courses loads
10. Verify /admin/export loads
11. Verify /admin/settings loads
12. Click logout
13. Verify redirect to /admin/login
14. Verify cannot access /admin without login

**Expected Results:**
- All pages accessible
- Navigation works smoothly
- No broken links
- Protected routes redirect to login
- Logout clears session

**Acceptance Criteria:**
- ✓ All routes accessible
- ✓ No 404 errors
- ✓ Navigation smooth
- ✓ Auth protection works

---

## MCP 11: Multi-Course Selection - Data Integrity
**Objective:** Verify multi-course selection persists correctly through entire flow

**Path:** Select Multiple Courses → Submit → View in Admin → Export → Verify Consistency

**Steps:**
1. Homepage → Select courses [1, 2, 3]
2. Verify counter shows "3 courses"
3. Submit registration
4. Admin panel → View registration
5. Verify all 3 courses appear
6. Admin → Export Data
7. Verify Excel shows all 3 courses
8. Verify course IDs match selected courses
9. Admin → Refresh Data
10. Verify courses still show correctly

**Expected Results:**
- All selected courses persist through database
- Admin displays all courses
- Export includes all courses
- No course data loss
- Data consistency maintained

**Acceptance Criteria:**
- ✓ All courses saved to database
- ✓ Admin displays correct courses
- ✓ Export shows all courses
- ✓ Data consistent throughout

---

## MCP 12: Performance - Load Times
**Objective:** Verify acceptable performance metrics

**Path:** Load Pages → Measure Load Times → Check Performance

**Metrics to Measure:**
- Homepage load time (< 3 seconds)
- Admin login page load time (< 2 seconds)
- Admin dashboard load time (< 3 seconds)
- Form submission time (< 2 seconds)
- Export generation time (< 5 seconds)
- Course fetch time (< 1 second)

**Steps:**
1. Open DevTools → Network tab
2. Load homepage
3. Measure total load time
4. Check Network tab for slow resources
5. Repeat for other pages
6. Use Lighthouse for performance audit
7. Check for any 404 errors
8. Verify all resources load successfully

**Expected Results:**
- All pages load within acceptable time
- No resource loading errors
- Lighthouse score > 70
- Images optimized
- No console errors

**Acceptance Criteria:**
- ✓ Homepage loads in < 3s
- ✓ Admin pages load in < 3s
- ✓ No 404 errors
- ✓ No console errors

---

## MCP 13: Browser Compatibility
**Objective:** Verify works on major browsers

**Browsers to Test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Steps:**
1. Test each browser with same flow:
   - Navigate to homepage
   - Fill and submit registration form
   - Select multiple courses
   - Verify success
   - Login to admin
   - View registrations
   - Logout

**Expected Results:**
- Form works on all browsers
- Styling consistent across browsers
- No JavaScript errors
- Responsive design works

**Acceptance Criteria:**
- ✓ Works on Chrome
- ✓ Works on Firefox
- ✓ Works on Safari
- ✓ Works on Edge

---

## MCP 14: Error Recovery - Session Timeout
**Objective:** Verify graceful error handling

**Path:** Login → Wait Session Expire → Attempt Action → Verify Error Handling

**Steps:**
1. Login to admin panel
2. Note session expiry time (12 hours in config)
3. Simulate session expiry (modify localStorage)
4. Try to access admin page
5. Verify appropriate error or redirect
6. Verify can login again
7. Verify no data corruption

**Expected Results:**
- Session timeout handled gracefully
- User redirected to login
- No data loss
- Can re-login without issues

**Acceptance Criteria:**
- ✓ Session timeout handled
- ✓ Redirects to login
- ✓ No errors or data loss

---

## MCP 15: Accessibility - Screen Reader
**Objective:** Verify form accessibility for users with disabilities

**Path:** Use Screen Reader → Navigate Form → Submit → Verify Accessibility

**Steps:**
1. Enable screen reader (NVDA on Windows, VoiceOver on Mac)
2. Navigate to homepage
3. Listen to page description
4. Tab through form fields
5. Verify labels are read for each field
6. Verify checkboxes have descriptions
7. Verify buttons are labeled
8. Verify error messages are announced
9. Verify success message is announced
10. Test with keyboard only (no mouse)

**Expected Results:**
- All form fields have labels
- Screen reader announces field names
- Checkboxes have descriptions
- Navigation with Tab key works
- Success/error messages announced
- All features accessible via keyboard

**Acceptance Criteria:**
- ✓ Form accessible via keyboard
- ✓ Screen reader works
- ✓ Labels properly associated
- ✓ Errors announced

---

## Test Execution Results Template

### Test Summary
- Total MCPs: 15
- Status: PASS/FAIL/PARTIAL
- Critical Issues: X
- Non-Critical Issues: Y
- Performance: Good/Fair/Poor

### Detailed Results

#### MCP 1: Student Registration
- Status: PASS/FAIL
- Issues: [List any issues]
- Evidence: [Screenshots or logs]

[Continue for each MCP...]

### Browser Results
- Chrome: PASS/FAIL
- Firefox: PASS/FAIL
- Safari: PASS/FAIL
- Edge: PASS/FAIL

### Device Results
- Mobile (390x844): PASS/FAIL
- Tablet (768x1024): PASS/FAIL
- Desktop (1920x1080): PASS/FAIL

### Performance Results
- Homepage Load: XXXms
- Admin Dashboard: XXXms
- Form Submit: XXXms
- Export: XXXms

### Critical Issues Found
1. [Issue Title]
   - Severity: Critical
   - Impact: [Describe impact]
   - Steps to Reproduce: [List steps]
   - Solution: [Suggested fix]

### Non-Critical Issues Found
1. [Issue Title]
   - Severity: Minor
   - Impact: [Describe impact]

### Recommendations
1. [Enhancement 1]
2. [Enhancement 2]
3. [Enhancement 3]

---

