import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import { fetchPublicEvents, registerForEvent } from '../store/slices/eventsSlice';
import { RootState, AppDispatch } from '../store/store';
import { Calendar, Search, Filter, Users, MapPin } from 'lucide-react';

const PublicEvents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, registeredEvents, isLoading } = useSelector((state: RootState) => state.events);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    dispatch(fetchPublicEvents());
  }, [dispatch]);

  const handleRegister = (eventId: string) => {
    if (isAuthenticated) {
      dispatch(registerForEvent(eventId));
    }
  };

  const isUserRegistered = (eventId: string) => {
    return registeredEvents.some(event => event.id === eventId);
  };

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      // Only show approved public events
      if (event.status !== 'approved' || !event.isPublic) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower) ||
          event.organizerName.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .filter(event => {
      // Category filter
      if (filterBy === 'available') {
        return event.registeredCount < event.capacity;
      } else if (filterBy === 'full') {
        return event.registeredCount >= event.capacity;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'capacity':
          return (b.capacity - b.registeredCount) - (a.capacity - a.registeredCount);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Calendar className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Public Events</h1>
              <p className="text-muted-foreground">
                Discover and register for upcoming campus events
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search events by title, description, location, or organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="capacity">Available Spots</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold text-foreground">{events.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-success mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-foreground">
                  {events.filter(e => e.registeredCount < e.capacity).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-warning mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {isAuthenticated ? 'Registered' : 'Featured'}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {isAuthenticated ? registeredEvents.length : events.filter(e => e.capacity > 100).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showRegistration={isAuthenticated && user?.role === 'student'}
                isRegistered={isUserRegistered(event.id)}
                onRegister={handleRegister}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? 'No events found' : 'No public events available'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or filters to find events.'
                : 'Check back later for new events or contact event organizers.'
              }
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Call to Action for Non-Authenticated Users */}
        {!isAuthenticated && filteredEvents.length > 0 && (
          <div className="mt-12 text-center bg-muted rounded-lg p-8">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Join the Community
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Sign up to register for events, create your own events, and connect with your campus community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a href="/register">Get Started</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/login">Already have an account?</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEvents;