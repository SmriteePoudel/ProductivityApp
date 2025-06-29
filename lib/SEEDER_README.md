# Database Seeder

This seeder file provides comprehensive database seeding functionality for the productivity app. It can populate your database with sample data for testing and development purposes.

## Features

- **Complete Data Seeding**: Seeds all major entities (Users, Categories, Tasks, Projects, Pages)
- **Flexible Seeding**: Can seed specific data types or everything at once
- **Realistic Sample Data**: Provides realistic, varied sample data
- **Password Hashing**: Automatically hashes passwords using bcrypt
- **Database Reset**: Can clear all data for fresh starts
- **User-Friendly**: Provides clear console output and login credentials
- **Comprehensive Permissions**: Role-based permission system with 5 different roles

## Sample Data Included

### Users (10 users with different roles)

#### **Admin Role** 👑

- **Admin User** (admin@example.com) - Full system access with complete control

#### **Moderator Role** 🛡️

- **Jane Smith** (jane@example.com) - Team lead with enhanced permissions
- **Diana Prince** (diana@example.com) - Senior moderator with analytics access

#### **Editor Role** ✏️

- **Charlie Brown** (charlie@example.com) - Content editor (create/edit, no delete)
- **George Lucas** (george@example.com) - Creative director with sharing capabilities

#### **User Role** 👤

- **John Doe** (john@example.com) - Product manager with standard permissions
- **Bob Wilson** (bob@example.com) - Developer with limited delete permissions
- **Edward Norton** (edward@example.com) - Junior developer with basic permissions

#### **Viewer Role** 👁️

- **Alice Johnson** (alice@example.com) - Stakeholder with read-only access
- **Fiona Gallagher** (fiona@example.com) - Client representative with analytics access

### Role-Based Permission System

#### **Admin** (Level 5) - Full Access

- ✅ Create, read, update, delete all content
- ✅ Manage users and roles
- ✅ Access admin panel and analytics
- ✅ Export and import data
- ✅ Override permissions
- ✅ View all data across the system
- ✅ Bulk operations
- ✅ System configuration

#### **Moderator** (Level 4) - Enhanced Management

- ✅ Create, read, update, delete content
- ✅ Manage users (but not roles)
- ✅ Access admin panel
- ✅ View analytics and export data
- ✅ Invite users and manage teams
- ✅ Bulk operations
- ✅ View all data

#### **Editor** (Level 3) - Content Creation

- ✅ Create and edit content
- ✅ View content
- ✅ Share content
- ❌ Cannot delete content
- ❌ No administrative access

#### **User** (Level 2) - Standard Access

- ✅ Create, read, update, delete own content
- ✅ Share content
- ✅ View own data
- ❌ No administrative access

#### **Viewer** (Level 1) - Read-Only

- ✅ View content only
- ❌ Cannot create, edit, or delete
- ❌ Limited access to shared content
- ❌ No administrative access

### Categories (8 categories per user)

- Work, Personal, Health, Learning, Finance, Home, Travel, Shopping
- Each with unique colors and icons

### Tasks (3-8 per user)

- Various statuses: pending, in-progress, completed
- Different priorities: low, medium, high, urgent
- Realistic due dates and time estimates
- Tags for organization

### Projects (2-4 per user)

- Different project types with descriptions
- Various statuses: active, completed, on-hold
- Sample file attachments

### Pages (1-3 per user)

- Meeting notes, project ideas, personal goals
- Text content examples

## Usage

### Using npm scripts (Recommended)

```bash
# Seed all data
npm run db:seed

# Seed only users
npm run db:users

# Seed only categories
npm run db:categories

# Reset all data
npm run db:reset

# Interactive seeding (shows help)
npm run seed
```

### Direct execution

```bash
# Seed all data
node scripts/seed.js seed

# Seed only users
node scripts/seed.js users

# Seed only categories
node scripts/seed.js categories

# Reset all data
node scripts/seed.js reset
```

### Programmatic usage

```javascript
import {
  seedDatabase,
  seedUsers,
  seedCategories,
  resetDatabase,
} from "./lib/seeder.js";

// Seed everything
await seedDatabase();

// Seed specific data
await seedUsers();
await seedCategories();

// Reset database
await resetDatabase();
```

## Login Credentials

After seeding, you can log in with these credentials:

| User            | Email               | Password    | Role      | Level | Capabilities       |
| --------------- | ------------------- | ----------- | --------- | ----- | ------------------ |
| Admin User      | admin@example.com   | admin123    | admin     | 5     | Full system access |
| Jane Smith      | jane@example.com    | password123 | moderator | 4     | Team management    |
| Diana Prince    | diana@example.com   | password123 | moderator | 4     | Analytics access   |
| Charlie Brown   | charlie@example.com | password123 | editor    | 3     | Content creation   |
| George Lucas    | george@example.com  | password123 | editor    | 3     | Enhanced sharing   |
| John Doe        | john@example.com    | password123 | user      | 2     | Standard access    |
| Bob Wilson      | bob@example.com     | password123 | user      | 2     | Limited delete     |
| Edward Norton   | edward@example.com  | password123 | user      | 2     | Basic access       |
| Alice Johnson   | alice@example.com   | password123 | viewer    | 1     | Read-only          |
| Fiona Gallagher | fiona@example.com   | password123 | viewer    | 1     | Analytics viewer   |

## Permission System Features

### **Comprehensive Permissions**

- **Basic CRUD**: Create, read, update, delete operations
- **Administrative**: User management, role management, system reset
- **Content Management**: Task, category, project, page management
- **System Access**: Admin panel, analytics, data export/import
- **Collaboration**: Content sharing, user invitations, team management
- **Advanced**: Bulk operations, permission overrides, all-data access

### **Role Hierarchy**

- **Level 5**: Admin (full access)
- **Level 4**: Moderator (enhanced management)
- **Level 3**: Editor (content creation)
- **Level 2**: User (standard access)
- **Level 1**: Viewer (read-only)

### **Permission Inheritance**

- Higher-level roles inherit permissions from lower levels
- Custom permission overrides are supported
- Role-based default permissions are automatically applied

## Database Requirements

The seeder requires:

- MongoDB connection (configured in `lib/db.js`)
- All models to be properly defined
- bcryptjs for password hashing

## Environment Setup

Make sure your MongoDB connection is properly configured in your environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/productivity-app
```

## Customization

You can modify the sample data by editing the arrays in `lib/seeder.js`:

- `sampleUsers` - User data with role-based permissions
- `sampleCategories` - Category templates
- `sampleTasks` - Task templates
- `sampleProjects` - Project templates
- `samplePages` - Page templates
- `roleDescriptions` - Role metadata and descriptions

## Safety Features

- **Duplicate Prevention**: Won't create duplicate users or categories
- **Data Validation**: Uses Mongoose validation
- **Error Handling**: Comprehensive error handling and logging
- **Safe Reset**: Confirms before clearing data
- **Permission Validation**: Validates all permissions against schema

## Troubleshooting

### Common Issues

1. **Connection Error**: Make sure MongoDB is running and accessible
2. **Model Errors**: Ensure all models are properly imported
3. **Permission Errors**: Check file permissions for the scripts directory
4. **Role Conflicts**: Verify role names match the enum in User model

### Debug Mode

For debugging, you can add console.log statements in the seeder functions or run with Node.js debug flags:

```bash
NODE_OPTIONS="--inspect" npm run db:seed
```

## Contributing

When adding new models or data types:

1. Add sample data arrays
2. Create seeding functions
3. Update the main `seedDatabase()` function
4. Add npm scripts if needed
5. Update this documentation
6. Consider permission implications for new features
