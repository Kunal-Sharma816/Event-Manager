# EventWeaver Backend API

A comprehensive backend API for the Campus Event Management Portal built with Node.js, Express, and MongoDB.

## Features

- **JWT Authentication** with secure cookies
- **Role-Based Access Control (RBAC)** with four user roles:
  - Admin: Manage users & approve/reject events
  - Organizer: Create, edit, delete their own events
  - Student: Register for events & view details
  - Guest: View approved public events only
- **Event Management** with approval workflow
- **Event Registration** system with capacity management
- **MongoDB** database with Mongoose ODM
- **CORS** configuration for frontend integration
- **Rate Limiting** and security middleware
- **Input Validation** with express-validator

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp config/env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eventweaver
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:5173
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/profile` | Get user profile | Private |
| POST | `/logout` | User logout | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/change-password` | Change password | Private |

### Event Routes (`/api/events`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/public` | Get public events | Public |
| GET | `/:id` | Get single event | Public |
| GET | `/` | Get all events | Admin |
| GET | `/my-events` | Get user's events | Organizer |
| GET | `/registered` | Get registered events | Student |
| POST | `/` | Create event | Organizer |
| PUT | `/:id` | Update event | Organizer/Admin |
| DELETE | `/:id` | Delete event | Organizer/Admin |
| PATCH | `/:id/approve` | Approve event | Admin |
| PATCH | `/:id/reject` | Reject event | Admin |
| POST | `/:id/register` | Register for event | Student |
| DELETE | `/:id/register` | Unregister from event | Student |

## Database Models

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: Enum ['admin', 'organizer', 'student', 'guest']
- `isActive`: Boolean (default: true)
- `lastLogin`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Event Model
- `title`: String (required)
- `description`: String (required)
- `date`: Date (required, future date)
- `time`: String (required, HH:MM format)
- `location`: String (required)
- `capacity`: Number (required, 1-10000)
- `registeredCount`: Number (default: 0)
- `status`: Enum ['pending', 'approved', 'rejected']
- `isPublic`: Boolean (default: true)
- `organizerId`: ObjectId (ref: User)
- `organizerName`: String (required)
- `tags`: [String]
- `imageUrl`: String
- `requirements`: String
- `contactInfo`: Object
- `createdAt`: Date
- `updatedAt`: Date

### Registration Model
- `userId`: ObjectId (ref: User)
- `eventId`: ObjectId (ref: Event)
- `status`: Enum ['registered', 'cancelled']
- `registeredAt`: Date
- `notes`: String

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/eventweaver |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `JWT_COOKIE_EXPIRE` | Cookie expiration (days) | 7 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `BCRYPT_ROUNDS` | Bcrypt salt rounds | 12 |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection protection (MongoDB)
- XSS protection

## Frontend Integration

The backend is designed to work seamlessly with the React frontend. Make sure to:

1. Set the `FRONTEND_URL` in your `.env` file
2. The frontend should make requests to `http://localhost:5000/api`
3. CORS is configured to allow credentials
4. JWT tokens are sent via Authorization header or cookies

## Error Handling

All API responses follow this format:

```json
{
  "success": boolean,
  "message": string,
  "data": object (optional),
  "errors": array (optional)
}
```

## License

MIT
