import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import { fetchAllEvents, approveEvent, rejectEvent } from '../store/slices/eventsSlice';
import { RootState, AppDispatch } from '../store/store';
import { 
  Settings, 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, isLoading } = useSelector((state: RootState) => state.events);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const handleApprove = (eventId: string) => {
    dispatch(approveEvent(eventId));
  };

  const handleReject = (eventId: string) => {
    dispatch(rejectEvent(eventId));
  };

  // Statistics
  const totalEvents = events.length;
  const pendingEvents = events.filter(e => e.status === 'pending').length;
  const approvedEvents = events.filter(e => e.status === 'approved').length;
  const rejectedEvents = events.filter(e => e.status === 'rejected').length;
  const totalRegistrations = events.reduce((sum, event) => sum + event.registeredCount, 0);

  // Filter events based on search and status
  const filterEvents = (status?: string) => {
    return events.filter(event => {
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !status || event.status === status;
      
      return matchesSearch && matchesStatus;
    });
  };

  const pendingEventsList = filterEvents('pending');
  const allEventsList = filterEvents();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}. Manage events and monitor platform activity.
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-400">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Events
              {pendingEvents > 0 && (
                <Badge className="ml-2 bg-warning text-warning-foreground">
                  {pendingEvents}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all-events">All Events</TabsTrigger>
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
                    All events in the system
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
                    Awaiting your review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved Events</CardTitle>
                  <CheckCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{approvedEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    Active and visible
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
                    Across all events
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            {pendingEvents > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 text-warning mr-2" />
                    Quick Actions Needed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {pendingEvents} event{pendingEvents !== 1 ? 's' : ''} awaiting approval
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Review and approve events to make them visible to students
                      </p>
                    </div>
                    <Button onClick={() => setActiveTab('pending')}>
                      Review Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-primary mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.slice(-5).reverse().map((event) => (
                    <div key={event.id} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          by {event.organizerName} • {event.registeredCount} registered
                        </p>
                      </div>
                      <div className="text-right">
                        {event.status === 'approved' && (
                          <Badge className="bg-success text-success-foreground">Approved</Badge>
                        )}
                        {event.status === 'pending' && (
                          <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                        )}
                        {event.status === 'rejected' && (
                          <Badge className="bg-danger text-danger-foreground">Rejected</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Events Tab */}
          <TabsContent value="pending" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search pending events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-warning" />
                <span className="font-medium">
                  {pendingEventsList.length} pending approval{pendingEventsList.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : pendingEventsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingEventsList.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showAdminActions={true}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  No pending events to review at this time.
                </p>
              </div>
            )}
          </TabsContent>

          {/* All Events Tab */}
          <TabsContent value="all-events" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search all events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : allEventsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allEventsList.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showAdminActions={event.status === 'pending'}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Events Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No events have been created yet.'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;