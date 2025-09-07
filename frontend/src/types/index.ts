// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'student' | 'guest';
  isActive?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  status: 'pending' | 'approved' | 'rejected';
  isPublic: boolean;
  organizerId: string;
  organizerName: string;
  tags?: string[];
  imageUrl?: string;
  requirements?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

// Event Creation/Update Types
export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  isPublic?: boolean;
  tags?: string[];
  imageUrl?: string;
  requirements?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

export type UpdateEventData = Partial<CreateEventData>;

// Registration Types
export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: 'registered' | 'cancelled';
  registeredAt: string;
  notes?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Error Types
export interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: string[];
    };
  };
  message?: string;
}

// Events API Response Types
export interface EventsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  events: Event[];
}

export interface EventResponse {
  success: boolean;
  event: Event;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registration?: Registration;
}
