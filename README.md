# Dream More Student Registration System

A modern, feature-rich student registration platform built with Next.js 16, Supabase, and a hybrid Material Design + Neumorphism UI design system. The application facilitates student registration with comprehensive personal details and course selections, while providing administrators with powerful management, export, and email distribution capabilities.

## Features

### Student Registration (Public)
- **Fully Open Access**: No authentication required for student registration
- **Personal Details Collection**:
  - First Name, Last Name, Email, Phone
  - Date of Birth, Gender
  - Complete Address (Street, City, State, Postal Code)
- **Course Selection**: 14+ specialized courses to choose from
- **Real-time Validation**: Form validation with helpful feedback
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

### Admin Dashboard
- **Registration Management**:
  - View all student registrations in an organized table
  - Search registrations by name or email
  - Filter by enrolled courses
  - Expandable rows to view complete details
- **Inline Editing**: Click to edit any field directly in the table
- **Delete Functionality**: Remove registrations when needed
- **Real-time Updates**: Changes sync instantly across the dashboard

### Admin Settings
- **Email Configuration**:
  - Set the admin email address that receives exports
  - Email persists in the database
  - Easy updates from the settings dashboard

### Data Export & Email
- **Excel Export**:
  - Download all registrations as XLSX file
  - Select specific records to export
  - Pre-formatted with proper column widths
- **Email Integration**:
  - Send Excel exports directly to admin email
  - One-click email delivery
  - Automatic file generation and attachment

### Excel Preview
- **Data Visualization**: View registration data in spreadsheet format
- **Sorting Options**:
  - Sort by Registration Date (Newest First)
  - Sort by Student Name (A-Z)
- **Export Statistics**: View record count, file format, and estimated size
- **Download from Preview**: Export directly from the preview page

## Technology Stack

- **Frontend**: Next.js 16 with React 19.2
- **Styling**: Tailwind CSS with custom Neumorphic utilities
- **Database**: Supabase PostgreSQL
- **Real-time Data**: SWR for client-side data fetching and caching
- **Excel Processing**: XLSX library
- **Email Service**: Node Mailer integration with API route
- **Icons**: Radix UI Icons
- **Components**: shadcn/ui

## Design System

### Color Palette
- **Primary**: Dark Navy Blue (#1a3a52)
- **Secondary/Accent**: Bright Orange (#ff8c42)
- **Background**: Light Gray (#f8f9fb)
- **Text**: Dark Blue (#1a3a52)

### Design Approach
- **Material Design** elements: Elevation, shadows, typography
- **Neumorphic** effects: Soft UI with subtle shadows and highlights
- **Interactive Elements**: Smooth transitions and hover effects
- **Accessibility**: WCAG compliant with proper contrast ratios

## Project Structure

```
├── app/
│   ├── page.tsx                 # Student registration page
│   ├── layout.tsx               # Root layout with metadata
│   ├── globals.css              # Theme and styling
│   └── admin/
│       ├── page.tsx             # Admin dashboard
│       ├── settings/page.tsx     # Admin settings
│       ├── export/page.tsx       # Export manager
│       └── preview/page.tsx      # Excel preview
├── components/
│   ├── student-registration-form.tsx
│   ├── admin-dashboard.tsx
│   ├── admin-settings.tsx
│   ├── export-manager.tsx
│   └── excel-preview.tsx
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser client
│       └── server.ts            # Server client
├── hooks/
│   └── use-registrations.ts      # SWR hook for data fetching
└── app/api/
    └── send-email/route.ts      # Email API endpoint
```

## Database Schema

### students table
```sql
CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  courses TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### admin_settings table
```sql
CREATE TABLE admin_settings (
  id BIGSERIAL PRIMARY KEY,
  admin_email VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT only_one_row CHECK (id = 1)
);
```

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file with Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Usage

### Student Registration
1. Visit the home page (`/`)
2. Fill in personal details
3. Select courses
4. Click "Submit Registration"
5. Receive confirmation message

### Admin Dashboard
1. Navigate to `/admin`
2. View all registrations
3. Search or filter registrations
4. Click on fields to edit
5. Expand rows to view full details
6. Delete registrations as needed

### Admin Settings
1. Go to `/admin/settings`
2. Configure the admin email address
3. Click "Save Settings"

### Export Data
1. Visit `/admin/export`
2. Select records to export (or leave empty for all)
3. Click "Download Excel" to download file
4. Click "Email to Admin" to send via email

### Preview Excel
1. Go to `/admin/preview`
2. Sort by date or name
3. View data in spreadsheet format
4. Download Excel file

## Available Courses

1. Graphics Designing
2. Video Editing
3. Digital Marketing
4. Cinematography
5. Web and Mobile App Development
6. Basic Computer Skill
7. Computer Maintenance
8. Mobile Maintenance
9. AI for Business
10. Cybersecurity & Data Safety
11. Robotics & Drone Technology
12. AI-Powered Freelancing
13. 3D Modeling & Product
14. Prototyping

## Features Details

### Real-time Inline Editing
- Click any cell in the admin dashboard to edit
- Press Enter to save or Escape to cancel
- Changes are immediately saved to database
- SWR automatically updates all related data

### Search & Filter
- Search by full name or email address
- Filter registrations by selected course
- Combines both filters intelligently

### Excel Export
- Automatically formats data with proper columns
- Sets optimal column widths
- Includes all student information and courses
- Filename includes export date

### Email Integration
- Sends Excel file as attachment
- Uses configured admin email from settings
- Provides feedback on success/failure
- Works with SMTP or email service API

## Responsive Design

- **Mobile**: Single column layout, optimized touch targets
- **Tablet**: Two column layouts, adjusted spacing
- **Desktop**: Full three column layouts, maximum information density

## Accessibility

- Semantic HTML5 elements
- Proper color contrast ratios
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader friendly

## Performance Optimizations

- Client-side data caching with SWR
- Optimized database queries with indexes
- Minimal re-renders with React 19
- CSS optimizations with Tailwind
- Image optimization ready

## Security

- Row Level Security (RLS) enabled on all tables
- No sensitive data in environment variables
- Proper error handling without exposing internals
- CSRF protection via Next.js built-ins
- SQL injection prevention via parameterized queries

## Future Enhancements

- [ ] Authentication for admin access
- [ ] Batch email notifications
- [ ] Advanced reporting and analytics
- [ ] CSV import for bulk registration
- [ ] Student portal with profile updates
- [ ] Course management interface
- [ ] Payment integration
- [ ] SMS notifications

## Support

For issues or questions, please check the admin settings page to ensure your email is properly configured, and verify that all Supabase environment variables are correctly set.

## License

This project is created with v0.app and is intended for Dream More Training Center.
