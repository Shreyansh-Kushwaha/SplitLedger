# SplitLedger - Professional Full-Stack Expense Tracker

A modern, full-stack application for tracking money lent and borrowed between friends, built with professional code organization and best practices.

## 🚀 Features

- **User Authentication**: Secure JWT-based login and registration
- **Transaction Management**: Add, view, and settle transactions
- **Real-time Calculations**: Automatic net amount calculations per person
- **User Search**: Find and connect with friends
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Professional Architecture**: Clean separation of concerns with components, hooks, and services

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication components
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── Dashboard/       # Dashboard cards
│   │   ├── TotalsCard.jsx
│   │   └── NetEffectiveCard.jsx
│   ├── Layout/          # Layout components
│   │   └── Header.jsx
│   ├── Transactions/    # Transaction-related components
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionItem.jsx
│   │   └── TransactionList.jsx
│   └── User/            # User management components
│       └── UserSearch.jsx
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication logic
│   └── useTransactions.js # Transaction management
├── services/            # API and utility services
│   ├── api.js           # API client
│   └── auth.js          # Authentication service
├── App.jsx              # Main application component
└── index.css            # Global styles
```

### Backend Structure
```
backend/
├── index.js             # Express server setup
├── models/             # Mongoose models
│   └── User.js
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   └── transactions.js # Transaction routes
└── middleware/         # Express middleware
    └── auth.js         # JWT authentication middleware
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Hooks** - Encapsulated stateful logic
- **Component Architecture** - Modular, reusable components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# PORT=5000
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with:
# VITE_API_URL=http://localhost:5000
npm run dev
```

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Code Organization Principles

1. **Separation of Concerns**: Each component has a single responsibility
2. **Custom Hooks**: Business logic extracted into reusable hooks
3. **Service Layer**: API calls abstracted into service modules
4. **Component Composition**: Complex UIs built from smaller components
5. **Consistent Naming**: Clear, descriptive naming conventions
6. **Error Handling**: Proper error boundaries and user feedback

### Component Patterns

- **Container Components**: Handle data fetching and state management
- **Presentational Components**: Focus on UI rendering and user interaction
- **Custom Hooks**: Encapsulate related stateful logic
- **Service Modules**: Handle external API communication

## 🚀 Deployment

### Backend Deployment
The backend can be deployed to services like:
- Heroku
- Railway
- Render
- AWS EC2

### Frontend Deployment
The frontend can be deployed to services like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern React patterns and best practices
- Inspired by expense tracking applications
- Designed for simplicity and maintainability