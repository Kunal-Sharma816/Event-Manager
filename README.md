# EventWeaver Campus Management Portal

A comprehensive full-stack application for managing campus events with role-based access control.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
1. Double-click `start-project.bat` to start both backend and frontend servers
2. Backend will start on http://localhost:5000
3. Frontend will start on http://localhost:5173

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd eventweaver-campus
npm install
npm run dev
```

## 📁 Project Structure

```
QpiAi/
├── backend/                 # Node.js/Express Backend
│   ├── controllers/         # Route controllers
│   │   ├── auth/           # Authentication controllers
│   │   └── events/         # Event controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── server.js           # Main server file
├── eventweaver-campus/      # React Frontend
│   ├── src/
│   │   ├── api/            # API integration
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   └── utils/          # Utility functions
│   └── package.json
└── start-project.bat       # One-click startup script
```

## 🔧 Features

### Backend Features
- **JWT Authentication** with secure cookies
- **Role-Based Access Control (RBAC)**
- **MongoDB** database with Mongoose ODM
- **Event Management** with approval workflow
- **Event Registration** system
- **CORS** configuration for frontend integration
- **Rate Limiting** and security middleware
- **Input Validation** with express-validator

### Frontend Features
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Axios** for API communication
- **Responsive Design**

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Manage users, approve/reject events, view all events |
| **Organizer** | Create, edit, delete own events |
| **Student** | Register for events, view event details |
| **Guest** | View approved public events only |

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- Helmet
- Express Rate Limit

### Frontend
- React 18
- TypeScript
- Vite
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- Shadcn/ui
- Lucide React

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile
- `POST /logout` - User logout

### Events (`/api/events`)
- `GET /public` - Get public events
- `GET /` - Get all events (Admin)
- `GET /my-events` - Get user's events (Organizer)
- `GET /registered` - Get registered events (Student)
- `POST /` - Create event (Organizer)
- `PUT /:id` - Update event (Organizer/Admin)
- `DELETE /:id` - Delete event (Organizer/Admin)
- `PATCH /:id/approve` - Approve event (Admin)
- `PATCH /:id/reject` - Reject event (Admin)
- `POST /:id/register` - Register for event (Student)
- `DELETE /:id/register` - Unregister from event (Student)

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eventweaver
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use a MongoDB cloud service (MongoDB Atlas)
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd eventweaver-campus
npm run test
```

## 📝 Development

### Adding New Features
1. Backend: Add routes in `routes/`, controllers in `controllers/`
2. Frontend: Add components in `src/components/`, pages in `src/pages/`
3. Update API integration in `src/api/`
4. Update Redux store if needed

### Database Schema
- **Users**: Authentication and profile data
- **Events**: Event information and metadata
- **Registrations**: User-event relationships

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy Coding! 🎉**
