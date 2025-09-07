import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';
import Navbar from '../components/Navbar';
import { 
  fetchUserEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  clearError 
} from '../store/slices/eventsSlice';
import { RootState, AppDispatch } from '../store/store';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle,
  Search,
  Edit,
  BarChart3,
  AlertCircle
} from 'lucide-react';

interface Event {
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
  createdAt: string;
  tags?: string[];
  requirements?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

// Type for event form data
interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  isPublic: boolean;
  tags?: string[];
  requirements?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

const OrganizerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userEvents, isLoading, error } = useSelector((state: RootState) => state.events);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    dispatch(fetchUserEvents());
  }, [dispatch]);

  // Clear errors when component mounts or form opens/closes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleCreateEvent = async (eventData: EventFormData) => {
    try {
      console.log('Creating event with data:', eventData);
      const resultAction = await dispatch(createEvent(eventData));
      
      if (createEvent.fulfilled.match(resultAction)) {
        console.log('Event created successfully');
        setIsFormOpen(false);
        // Optionally refetch user events to ensure we have the latest data
        dispatch(fetchUserEvents());
      } else if (createEvent.rejected.match(resultAction)) {
        console.error('Failed to create event:', resultAction.payload);
        // Error will be shown via the error state
      }
    } catch (error) {
      console.error('Unexpected error creating event:', error);
    }
  };

  const handleUpdateEvent = async (eventData: EventFormData) => {
    if (editingEvent) {
      try {
        console.log('Updating event:', editingEvent.id, eventData);
        const resultAction = await dispatch(updateEvent({ 
          id: editingEvent.id, 
          eventData 
        }));
        
        if (updateEvent.fulfilled.match(resultAction)) {
          console.log('Event updated successfully');
          setEditingEvent(null);
          setIsFormOpen(false);
          dispatch(fetchUserEvents());
        } else if (updateEvent.rejected.match(resultAction)) {
          console.error('Failed to update event:', resultAction.payload);
        }
      } catch (error) {
        console.error('Unexpected error updating event:', error);
      }
    }
  };

  const handleEdit = (event: Event) => {
    console.log('Editing event:', event);
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const resultAction = await dispatch(deleteEvent(eventId));
        
        if (deleteEvent.fulfilled.match(resultAction)) {
          console.log('Event deleted successfully');
          dispatch(fetchUserEvents());
        } else if (deleteEvent.rejected.match(resultAction)) {
          console.error('Failed to delete event:', resultAction.payload);
        }
      } catch (error) {
        console.error('Unexpected error deleting event:', error);
      }
    }
  };

  const handleCancelForm = () => {
    setEditingEvent(null);
    setIsFormOpen(false);
    dispatch(clearError());
  };

  // Statistics
  const totalEvents = userEvents.length;
  const pendingEvents = userEvents.filter(e => e.status === 'pending').length;
  const approvedEvents = userEvents.filter(e => e.status === 'approved').length;
  const totalRegistrations = userEvents.reduce((sum, event) => sum + event.registeredCount, 0);

  // Filter events based on search
  const filteredEvents = userEvents.filter(event => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <BookOpen className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Organizer Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.name}. Manage your events and track engagement.
                </p>
              </div>
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center" disabled={isLoading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <EventForm
                  event={editingEvent || undefined}
                  onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
                  onCancel={handleCancelForm}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-400">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-events">My Events ({totalEvents})</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    Events you've created
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{pendingEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting admin review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Live Events</CardTitle>
                  <CheckCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{approvedEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    Approved and visible
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRegistrations}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all your events
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 text-primary mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    onClick={() => setIsFormOpen(true)}
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Event
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('my-events')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Manage Existing Events
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-primary mr-2" />
                    Event Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {totalEvents > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Average Registrations</span>
                        <span className="font-medium">
                          {Math.round(totalRegistrations / totalEvents)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Approval Rate</span>
                        <span className="font-medium">
                          {Math.round((approvedEvents / totalEvents) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Most Popular</span>
                        <span className="font-medium text-sm">
                          {userEvents.reduce((max, event) => 
                            event.registeredCount > max.registeredCount ? event : max, 
                            userEvents[0] || { title: 'N/A', registeredCount: 0 }
                          ).title.substring(0, 20)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Create your first event to see performance metrics.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Events */}
            {userEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    Recent Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userEvents.slice(-3).reverse().map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        showActions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Events Tab */}
          <TabsContent value="my-events" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search your events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button onClick={() => setIsFormOpen(true)} disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>

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
                    showActions={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchTerm ? 'No events found' : 'No events created yet'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? 'Try adjusting your search terms to find your events.'
                    : 'Get started by creating your first event. Share what you\'re passionate about with your campus community.'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsFormOpen(true)} disabled={isLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizerDashboard;