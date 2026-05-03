#!/bin/bash
# Admin Panel Quick Setup - Copy & Paste

# 1. Set environment variable for admin password
echo "Adding admin password to .env.local..."

# Option A: If you have a .env.local file, add this line:
# NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password_123

# Option B: Set in Vercel Dashboard:
# Project Settings → Environment Variables
# Name: NEXT_PUBLIC_ADMIN_PASSWORD
# Value: your_admin_password_123

echo ""
echo "✅ Admin Panel Setup Complete!"
echo ""
echo "🔐 Access Admin Panel:"
echo "   URL: http://localhost:3000/admin/login"
echo "   Password: (set in .env.local or defaults to 'admin123')"
echo ""
echo "📚 Full Guide: See ADMIN_PANEL_GUIDE.md"
echo ""
echo "🎯 Quick Start:"
echo "   1. Login with admin password"
echo "   2. Go to 'Manage Courses'"
echo "   3. Click 'Bulk Add Courses'"
echo "   4. Enter course names (one per line)"
echo "   5. Click 'Add All Courses'"
echo ""
echo "🚀 Admin is now ready!"
