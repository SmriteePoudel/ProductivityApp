# Productivity Hub - Task Management App

A modern, full-stack task management and productivity application built with Next.js, MongoDB, and Tailwind CSS.

## 🚀 Features

### Core Functionality

- **User Authentication**: Secure login/registration with JWT tokens
- **Task Management**: Create, edit, delete, and organize tasks
- **Category System**: Organize tasks with custom categories and colors
- **Priority Levels**: Set task priorities (Low, Medium, High, Urgent)
- **Status Tracking**: Track task progress (Pending, In Progress, Completed, Cancelled)
- **Due Dates**: Set and track task deadlines
- **Time Estimation**: Estimate and track time spent on tasks
- **Tags**: Add custom tags to tasks for better organization

### Dashboard & Analytics

- **Progress Overview**: Visual progress bar and completion statistics
- **Task Statistics**: Real-time counts of tasks by status
- **Recent Tasks**: Quick access to latest tasks
- **Overdue Tracking**: Automatic detection of overdue tasks

### User Experience

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode**: Automatic dark/light theme support
- **Modern UI**: Beautiful, intuitive interface with smooth animations
- **Real-time Updates**: Instant feedback on all actions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Ready for Vercel deployment

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd productivity-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/productivity-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NODE_ENV=development
   ```

   **Note**: For AI Chat functionality, you'll need to get an API key from [OpenRouter](https://openrouter.ai/keys). The AI chat uses Claude 3 Haiku model for productivity assistance.

4. **Set up MongoDB**

   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud service)
   - Update the `MONGODB_URI` in your `.env.local` file

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### User Model

- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `avatar`: Profile picture URL
- `createdAt`, `updatedAt`: Timestamps

### Task Model

- `title`: Task title (required)
- `description`: Task description
- `status`: Task status (pending, in-progress, completed, cancelled)
- `priority`: Priority level (low, medium, high, urgent)
- `dueDate`: Task deadline
- `completedAt`: Completion timestamp
- `category`: Reference to Category model
- `user`: Reference to User model
- `tags`: Array of custom tags
- `isImportant`: Boolean flag for important tasks
- `estimatedTime`: Estimated time in minutes
- `actualTime`: Actual time spent in minutes

### Category Model

- `name`: Category name (required)
- `color`: Hex color code
- `icon`: Emoji icon
- `user`: Reference to User model

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Tasks

- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

## 🎨 UI Components

- **AuthForm**: Login/registration form
- **Dashboard**: Main dashboard with statistics and recent tasks
- **TaskList**: Task list with filtering and sorting
- **TaskForm**: Create/edit task modal
- **CategoryManager**: Category management interface

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **User Isolation**: Users can only access their own data
- **HTTPS Ready**: Configured for secure deployment

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app is compatible with any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/productivity-app/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

- [ ] Task templates
- [ ] Recurring tasks
- [ ] Team collaboration
- [ ] File attachments
- [ ] Calendar integration
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Time tracking
- [ ] Goal setting

---

**Built with ❤️ using Next.js, MongoDB, and Tailwind CSS**
