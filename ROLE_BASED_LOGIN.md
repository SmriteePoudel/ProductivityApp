# Role-Based Authentication System

This productivity app now includes a comprehensive role-based authentication system with 9 different user roles, each with their own dashboard and permissions.

## 🎯 Available Roles

### 1. **Admin** 👑

- **Email:** admin@example.com
- **Password:** admin123
- **Access:** Full system access, user management, analytics, system settings
- **Dashboard:** `/admin-dashboard`

### 2. **HR Manager** 👥

- **Email:** hr@example.com
- **Password:** hr123
- **Access:** Employee management, recruitment, performance reviews, HR reports
- **Dashboard:** `/hr-dashboard`

### 3. **Marketing Specialist** 📢

- **Email:** marketing@example.com
- **Password:** marketing123
- **Access:** Campaigns, content management, marketing analytics, social media
- **Dashboard:** `/marketing-dashboard`

### 4. **Finance Manager** 💰

- **Email:** finance@example.com
- **Password:** finance123
- **Access:** Budget management, expense tracking, financial reports, forecasting
- **Dashboard:** `/finance-dashboard`

### 5. **Blog Writer** ✍️

- **Email:** blog@example.com
- **Password:** blog123
- **Access:** Article management, drafts, content calendar, research tools
- **Dashboard:** `/blog-dashboard`

### 6. **SEO Manager** 🔍

- **Email:** seo@example.com
- **Password:** seo123
- **Access:** Keyword research, search rankings, SEO content, SEO analytics
- **Dashboard:** `/seo-dashboard`

### 7. **Project Manager** 📊

- **Email:** pm@example.com
- **Password:** pm123
- **Access:** Team management, project timeline, resource management, project reports
- **Dashboard:** `/project-dashboard`

### 8. **Developer** 💻

- **Email:** dev@example.com
- **Password:** dev123
- **Access:** Code repository, bug tracking, deployments, documentation
- **Dashboard:** `/developer-dashboard`

### 9. **Designer** 🎨

- **Email:** design@example.com
- **Password:** design123
- **Access:** Design projects, assets, prototypes, inspiration board
- **Dashboard:** `/designer-dashboard`

## 🚀 How to Use

1. **Start the application:**

   ```bash
   npm run dev
   ```

2. **Navigate to the login page:**

   - Go to `http://localhost:3000`

3. **Login with any role:**

   - Use the email and password from the list above
   - You'll be automatically redirected to your role-specific dashboard

4. **Role-Specific Features:**
   - Each role has a unique dashboard with role-specific navigation
   - Different color schemes and themes for each role
   - Role-specific content sections and tools
   - Customized permissions and access levels

## 🎨 Dashboard Themes

Each role has a unique visual theme:

- **Admin:** Red/Purple gradient (👑)
- **HR:** Blue/Indigo gradient (👥)
- **Marketing:** Green/Emerald gradient (📢)
- **Finance:** Yellow/Amber gradient (💰)
- **Blog Writer:** Purple/Violet gradient (✍️)
- **SEO Manager:** Cyan/Blue gradient (🔍)
- **Project Manager:** Emerald/Teal gradient (📊)
- **Developer:** Slate/Gray gradient (💻)
- **Designer:** Pink/Rose gradient (🎨)

## 🔐 Security Features

- **Role-based access control (RBAC)**
- **JWT token authentication**
- **Secure password hashing**
- **Role-specific route protection**
- **Permission-based feature access**

## 📱 Features by Role

### Admin

- User management
- Role and permission management
- System analytics
- System configuration
- Full access to all features

### HR Manager

- Employee management
- Recruitment tracking
- Performance reviews
- HR reporting
- Team coordination

### Marketing Specialist

- Campaign management
- Content creation
- Marketing analytics
- Social media management
- Brand management

### Finance Manager

- Budget planning
- Expense tracking
- Financial reporting
- Financial forecasting
- Cost analysis

### Blog Writer

- Article management
- Draft management
- Content calendar
- Research tools
- Content planning

### SEO Manager

- Keyword research
- Ranking tracking
- SEO content optimization
- SEO analytics
- Search performance

### Project Manager

- Team management
- Project timeline
- Resource allocation
- Project reporting
- Task coordination

### Developer

- Code repository
- Bug tracking
- Deployment management
- Technical documentation
- Development tools

### Designer

- Design project management
- Asset management
- Prototype creation
- Inspiration board
- Design tools

## 🔧 Technical Implementation

- **Frontend:** Next.js with React
- **Backend:** Next.js API routes
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens
- **Styling:** Tailwind CSS
- **State Management:** React hooks

## 📝 Customization

You can easily add new roles by:

1. Adding the role to the User model enum
2. Creating role-specific permissions
3. Adding role-specific navigation items
4. Creating role-specific dashboard content
5. Adding role-specific routes

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the user creation script: `node scripts/create-users.js`
5. Start the development server: `npm run dev`
6. Login with any of the provided credentials

## 📞 Support

For questions or issues with the role-based authentication system, please refer to the main project documentation or create an issue in the repository.
