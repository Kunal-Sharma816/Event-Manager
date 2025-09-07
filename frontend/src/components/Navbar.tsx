import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { 
  Calendar, 
  LogOut, 
  User, 
  Settings, 
  Users, 
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children, className = '' }: { to: string; children: React.ReactNode; className?: string }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive(to)
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-foreground hover:bg-muted hover:text-primary'
      } ${className}`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-foreground">CampusEvents</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/events" className='bg-blue-500 text-white'>Public Events</NavLink>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <NavLink to="/admin">
                    <Settings className="inline h-4 w-4 mr-1" />
                    Admin Panel
                  </NavLink>
                )}
                {user?.role === 'organizer' && (
                  <NavLink to="/organizer">
                    <BookOpen className="inline h-4 w-4 mr-1" />
                    My Events
                  </NavLink>
                )}
                {user?.role === 'student' && (
                  <NavLink to="/student">
                    <User className="inline h-4 w-4 mr-1" />
                    Dashboard
                  </NavLink>
                )}
                
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border">
                  <span className="text-sm text-muted-foreground">
                    {user?.name} ({user?.role})
                  </span>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="ml-2"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border mt-2 pt-2 pb-4">
            <div className="flex flex-col space-y-2">
              <NavLink to="/events">Public Events</NavLink>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <NavLink to="/admin">
                      <Settings className="inline h-4 w-4 mr-1" />
                      Admin Panel
                    </NavLink>
                  )}
                  {user?.role === 'organizer' && (
                    <NavLink to="/organizer">
                      <BookOpen className="inline h-4 w-4 mr-1" />
                      My Events
                    </NavLink>
                  )}
                  {user?.role === 'student' && (
                    <NavLink to="/student">
                      <User className="inline h-4 w-4 mr-1" />
                      Dashboard
                    </NavLink>
                  )}
                  
                  <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground px-3">
                      {user?.name} ({user?.role})
                    </span>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="mx-3"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                  <Button asChild variant="outline" className="mx-3">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button asChild className="mx-3">
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;