# Dream More Student Registration System - Architecture Overview

## System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT REGISTRATION APP                      │
└─────────────────────────────────────────────────────────────────┘

PUBLIC PAGES
────────────────────────────────────────────────────────────────
│
├─ / (Root)
│  ├─ StudentRegistrationForm
│  │  ├─ Personal Details Form
│  │  │  ├─ First Name, Last Name
│  │  │  ├─ Email, Phone
│  │  │  ├─ Date of Birth
│  │  │  ├─ Gender (Male/Female)
│  │  │  ├─ Address, City
│  │  │  └─ Submission
│  │  │
│  │  └─ Dynamic Course Selection
│  │     ├─ Fetches from GET /api/courses
│  │     ├─ Shows course names + descriptions
│  │     ├─ Checkboxes for multi-select
│  │     └─ Stores course IDs
│  │
│  └─ Data Flow
│     └─ POST to Supabase students table


ADMIN PAGES
────────────────────────────────────────────────────────────────
│
├─ AdminNav (Shared across all admin pages)
│  ├─ Dashboard (link)
│  ├─ Manage Courses (link) ← NEW
│  ├─ Settings (link)
│  └─ Export & Email (link)
│
│
├─ /admin
│  ├─ AdminNav
│  ├─ AdminDashboard
│  │  ├─ Search & Filter Students
│  │  ├─ View Registration Details
│  │  ├─ Real-time Editing
│  │  └─ Delete Registration
│  │
│  └─ Data Flow
│     └─ GET /api/registrations


├─ /admin/courses ← NEW
│  ├─ AdminNav
│  ├─ CourseManagement
│  │  ├─ Course Form (Left)
│  │  │  ├─ Course Code input
│  │  │  ├─ Course Name input
│  │  │  ├─ Description textarea
│  │  │  └─ Save/Cancel buttons
│  │  │
│  │  └─ Course List (Right)
│  │     ├─ Available Courses Display
│  │     ├─ Edit buttons per course
│  │     ├─ Delete buttons per course
│  │     └─ Statistics (Total courses)
│  │
│  └─ Data Flow
│     ├─ GET /api/courses
│     ├─ POST /api/courses (add)
│     ├─ PUT /api/courses (edit)
│     └─ DELETE /api/courses (remove)


├─ /admin/settings
│  ├─ AdminNav
│  ├─ AdminSettings
│  │  └─ Email Configuration
│  │
│  └─ Data Flow
│     └─ GET/POST /api/admin-settings


├─ /admin/export
│  ├─ AdminNav
│  ├─ ExportManager
│  │  ├─ Export to Excel
│  │  ├─ Email File
│  │  └─ Preview Data
│  │
│  └─ Data Flow
│     └─ GET /api/registrations


└─ /admin/preview
   ├─ AdminNav
   ├─ ExcelPreview
   │  └─ Data Visualization
   │
   └─ Data Flow
      └─ GET /api/registrations
```

---

## Database Schema

```
SUPABASE POSTGRESQL
───────────────────────────────────────────────────────

┌─────────────────────┐
│     students        │
├─────────────────────┤
│ id (PK)             │
│ first_name          │
│ last_name           │
│ email               │
│ phone               │
│ date_of_birth       │
│ gender              │
│ address             │
│ city                │
│ courses (array)     │ ← Stores course IDs
│ created_at          │
│ updated_at          │
└─────────────────────┘


┌─────────────────────┐
│     courses         │ ← NEW
├─────────────────────┤
│ id (PK)             │
│ course_code (UQ)    │
│ course_name         │
│ description         │
│ created_at          │
│ updated_at          │
└─────────────────────┘


┌─────────────────────┐
│  admin_settings     │
├─────────────────────┤
│ id (PK)             │
│ admin_email         │
│ updated_at          │
└─────────────────────┘
```

---

## API Routes

```
REST API ENDPOINTS
───────────────────────────────────────────────────────

REGISTRATIONS
  GET    /api/registrations         → Fetch all students
  POST   /api/registrations         → [Not used]
  PUT    /api/registrations         → Update student
  DELETE /api/registrations         → Delete student

COURSES (NEW)
  GET    /api/courses               → Fetch all courses
  POST   /api/courses               → Create course
  PUT    /api/courses               → Update course
  DELETE /api/courses               → Delete course

ADMIN SETTINGS
  GET    /api/admin-settings        → Fetch email
  POST   /api/admin-settings        → Update email

EXPORT
  POST   /api/send-email            → Email Excel file
```

---

## Data Flow Diagrams

### Course Management Flow
```
Admin goes to /admin/courses
        ↓
CourseManagement component loads
        ↓
useCourses() hook calls GET /api/courses
        ↓
API queries Supabase courses table
        ↓
Returns array of courses
        ↓
Renders course list with Edit/Delete buttons
        ↓
Admin clicks Edit/Delete
        ↓
Form opens or confirmation dialog appears
        ↓
Admin submits changes
        ↓
PUT or DELETE /api/courses
        ↓
Supabase updated
        ↓
SWR revalidates and list refreshes
        ↓
UI updates immediately
```

### Student Registration Flow
```
Student visits /
        ↓
StudentRegistrationForm component loads
        ↓
useEffect runs:
  ├─ Fetches GET /api/courses
  └─ Sets state with course list
        ↓
Form displays:
  ├─ Personal details fields
  └─ Dynamic course checkboxes
        ↓
Student fills form
        ↓
Student selects courses (by ID)
        ↓
Student clicks Submit
        ↓
Form validates
        ↓
POST to Supabase students table
        ├─ personal details
  └─ courses: [1, 3, 5, 7]  ← Course IDs
        ↓
Success message shown
        ↓
Form resets
```

### Admin Dashboard Flow
```
Admin visits /admin
        ↓
AdminNav appears (top)
        ↓
AdminDashboard component loads
        ↓
useRegistrations() hook calls GET /api/registrations
        ↓
Returns all students with their data
        ↓
Renders searchable/filterable table
        ↓
Admin clicks Edit on a student
        ↓
Row becomes editable
        ↓
Admin modifies fields
        ↓
Admin saves
        ↓
PUT /api/registrations
        ↓
Supabase updated
        ↓
Table refreshes with new data
```

---

## Component Hierarchy

```
RootLayout
├─ head (metadata)
└─ body
   ├─ app/page.tsx (Student Registration)
   │  └─ StudentRegistrationForm
   │     ├─ Input (form fields)
   │     ├─ Checkbox (course selection)
   │     ├─ Button (submit)
   │     └─ Textarea (address)
   │
   └─ app/admin/
      ├─ layout (shared)
      │
      ├─ page.tsx (Dashboard)
      │  ├─ AdminNav ← NEW
      │  └─ AdminDashboard
      │     └─ Table (registrations)
      │
      ├─ courses/page.tsx ← NEW
      │  ├─ AdminNav ← NEW
      │  └─ CourseManagement ← NEW
      │     ├─ Input (course code)
      │     ├─ Input (course name)
      │     ├─ Textarea (description)
      │     ├─ Button (save/delete)
      │     └─ Course list display
      │
      ├─ settings/page.tsx
      │  ├─ AdminNav ← NEW
      │  └─ AdminSettings
      │     └─ Email input
      │
      └─ export/page.tsx
         ├─ AdminNav ← NEW
         └─ ExportManager
            └─ Export controls
```

---

## State Management Flow

```
Component State Flow

useCourses() Hook
├─ courses: Course[]
├─ isLoading: boolean
├─ error: Error | undefined
└─ mutate: () => void
   └─ Triggers SWR revalidation

StudentRegistrationForm State
├─ formData: FormData
│  ├─ first_name
│  ├─ last_name
│  ├─ email
│  ├─ phone
│  ├─ date_of_birth
│  ├─ gender
│  ├─ address
│  ├─ city
│  └─ courses: string[] (course IDs)
├─ loading: boolean
├─ courses: Course[] (fetched)
└─ coursesLoading: boolean

CourseManagement State
├─ courses: Course[]
├─ isLoading: boolean
├─ editingId: number | null
├─ isAdding: boolean
├─ formData: CourseFormData
├─ errors: Record<string, string>
└─ isSaving: boolean

AdminDashboard State
├─ registrations: Registration[]
├─ isLoading: boolean
├─ searchTerm: string
├─ filterCourse: string
├─ expandedRow: number | null
├─ editingId: number | null
└─ editFormData: FormData
```

---

## Authentication & Authorization

```
Current Setup (Development)
───────────────────────────
No authentication required
All endpoints publicly accessible
RLS policies allow all read/write

Production Recommendations
───────────────────────────
├─ Supabase Auth
│  └─ Admin login required
├─ JWT Tokens
│  └─ Validate on each request
├─ Role-Based Access Control
│  ├─ Admin role for course management
│  └─ Admin role for registration viewing
└─ Audit Logging
   └─ Track all changes
```

---

## Styling System

```
THEME COLORS
────────────────────────
Primary:     #1a3a52 (Navy Blue)
Secondary:   #ff8c42 (Orange)
Background:  #f8f9fb (Light)
Foreground:  #1a3a52 (Dark)
Muted:       #e8eef5 (Gray)
Accent:      #ff8c42 (Orange)
Destructive: #ef4444 (Red)

CSS UTILITIES
────────────────────────
Neumorphic Shadows
├─ .neomorph-light
├─ .neomorph-light-sm
└─ .neomorph-light-inset

Material Design Shadows
├─ .material-shadow-1
├─ .material-shadow-2
└─ .material-shadow-3

Interactive Elements
└─ .interactive-shadow (with hover/active states)

RESPONSIVE BREAKPOINTS
────────────────────────
Mobile:     < 640px
Tablet:     640px - 1024px
Desktop:    > 1024px

Using Tailwind:
- md: (768px)
- lg: (1024px)
```

---

## File Size & Performance

```
Components
──────────
StudentRegistrationForm:  ~12KB
CourseManagement:         ~14KB
AdminDashboard:           ~12KB
AdminNav:                 ~3KB
ExportManager:            ~9KB

Hooks
──────────
useCourses:               ~2KB
useRegistrations:         ~1KB

APIs
──────────
/api/courses:             ~3KB
/api/registrations:       ~3KB
/api/admin-settings:      ~1KB

Total App Size:           ~70KB (minified)
```

---

## Mobile Responsiveness

```
Mobile (< 640px)
───────────────────────────────────────
StudentRegistrationForm
├─ Single column layout
├─ Full-width inputs
├─ Touch-friendly buttons
└─ Scrollable course list

CourseManagement
├─ Form takes full width (top)
├─ Course list below
├─ Stacked action buttons
└─ Mobile-friendly spacing

AdminNav
├─ Icon-only labels
└─ Horizontal scroll if needed

Tablet (640px - 1024px)
───────────────────────────────────────
Hybrid layouts
├─ 2-column where possible
├─ Adjusted spacing
└─ Better use of horizontal space

Desktop (> 1024px)
───────────────────────────────────────
Full layouts
├─ Multi-column grids
├─ Side-by-side sections
├─ Optimal spacing
└─ All labels visible
```

---

## Integration Points

```
External Services
────────────────────────
Supabase
├─ PostgreSQL database
├─ Auth (optional)
└─ Real-time subscriptions (optional)

Email Service
└─ Supabase email (built-in)

File Generation
└─ XLSX library (course/registration export)

Icons
└─ Lucide React icons
└─ Radix UI icons
```

---

**System Status: FULLY OPERATIONAL ✅**
