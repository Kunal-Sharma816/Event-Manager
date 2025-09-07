import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EventCard from "../components/EventCard";
import Navbar from "../components/Navbar";
import {
  fetchRegisteredEvents,
  fetchPublicEvents,
  registerForEvent,
  clearError,
} from "../store/slices/eventsSlice";
import { RootState, AppDispatch } from "../store/store";
import {
  User,
  Calendar,
  Users,
  BookOpen,
  Search,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatDate, formatTime } from "../utils/dateHelpers";

const StudentDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, registeredEvents, isLoading, error } = useSelector(
    (state: RootState) => state.events
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [registrationLoading, setRegistrationLoading] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchRegisteredEvents());
    dispatch(fetchPublicEvents());
  }, [dispatch]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRegister = async (eventId: string) => {
    // Prevent double registration
    if (registrationLoading.has(eventId) || isUserRegistered(eventId)) {
      return;
    }

    setRegistrationLoading(prev => new Set(prev).add(eventId));
    
    try {
      console.log('Attempting to register for event:', eventId);
      const resultAction = await dispatch(registerForEvent(eventId));
      
      if (registerForEvent.fulfilled.match(resultAction)) {
        console.log('Registration successful');
        setSuccessMessage("Successfully registered for the event!");
        
        // Refresh both registered events and public events to update the UI
        await Promise.all([
          dispatch(fetchRegisteredEvents()),
          dispatch(fetchPublicEvents())
        ]);
      } else if (registerForEvent.rejected.match(resultAction)) {
        console.error('Registration failed:', resultAction.payload);
        // Error will be displayed via the error state from Redux
      }
    } catch (error) {
      console.error('Unexpected error during registration:', error);
    } finally {
      setRegistrationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const isUserRegistered = (eventId: string) => {
    return registeredEvents.some((event) => event.id === eventId);
  };

  const isRegistrationInProgress = (eventId: string) => {
    return registrationLoading.has(eventId);
  };

  // Filter available events (not registered, approved, public, not full)
  const availableEvents = events.filter(
    (event) =>
      event.status === "approved" &&
      event.isPublic &&
      !isUserRegistered(event.id) &&
      event.registeredCount < event.capacity
  );

  // Filter events based on search
  const filterEvents = (eventList: typeof events) => {
    if (!searchTerm) return eventList;

    const searchLower = searchTerm.toLowerCase();
    return eventList.filter(
      (event) =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower) ||
        event.organizerName?.toLowerCase().includes(searchLower)
    );
  };

  const filteredRegisteredEvents = filterEvents(registeredEvents);
  const filteredAvailableEvents = filterEvents(availableEvents);

  // Get upcoming events (registered events in the future)
  const upcomingEvents = registeredEvents
    .filter((event) => {
      const eventDate = new Date(`${event.date} ${event.time}`);
      return eventDate > new Date();
    })
    .sort(
      (a, b) =>
        new Date(`${a.date} ${a.time}`).getTime() -
        new Date(`${b.date} ${b.time}`).getTime()
    );

  const nextEvent = upcomingEvents[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <User className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Student Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}. Discover and manage your campus events.
              </p>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registered">
              My Events ({registeredEvents.length})
            </TabsTrigger>
            <TabsTrigger value="discover">
              Discover ({availableEvents.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Registered Events
                  </CardTitle>
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {registeredEvents.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your confirmed registrations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Events
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {upcomingEvents.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Events you'll attend
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Available Events
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {availableEvents.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    New events to explore
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    This Month
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      registeredEvents.filter((event) => {
                        const eventDate = new Date(event.date);
                        const now = new Date();
                        return (
                          eventDate.getMonth() === now.getMonth() &&
                          eventDate.getFullYear() === now.getFullYear()
                        );
                      }).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Events this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Next Event */}
            {nextEvent && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    Your Next Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {nextEvent.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {nextEvent.description.substring(0, 150)}...
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          {formatDate(nextEvent.date)} at{" "}
                          {formatTime(nextEvent.time)}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-2 text-primary" />
                          {nextEvent.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-center p-6 bg-primary/10 rounded-lg">
                        <Calendar className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="font-medium">Coming Up Soon!</p>
                        <p className="text-sm text-muted-foreground">
                          Don't forget to attend
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions and Trending Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full justify-start"
                    onClick={() => setActiveTab("discover")}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Discover New Events
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("registered")}
                  >
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    View My Registrations
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-primary mr-2" />
                    Trending Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {availableEvents.length > 0 ? (
                    <div className="space-y-3">
                      {availableEvents
                        .sort((a, b) => b.registeredCount - a.registeredCount)
                        .slice(0, 3)
                        .map((event) => (
                          <div
                            key={event.id}
                            className="flex justify-between items-center p-2 bg-muted/50 rounded"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {event.title.length > 30 
                                  ? `${event.title.substring(0, 30)}...` 
                                  : event.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {event.registeredCount} registered
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRegister(event.id)}
                              disabled={isRegistrationInProgress(event.id)}
                            >
                              {isRegistrationInProgress(event.id) ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                              ) : (
                                "Join"
                              )}
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No events available right now.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Registrations */}
            {registeredEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarCheck className="h-5 w-5 text-primary mr-2" />
                    Recent Registrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {registeredEvents
                      .slice(-3)
                      .reverse()
                      .map((event) => (
                        <EventCard key={event.id} event={event} isRegistered={true} />
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Registered Events Tab */}
          <TabsContent value="registered" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search your registered events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredRegisteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRegisteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} isRegistered={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchTerm ? "No events found" : "No registered events yet"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchTerm
                    ? "Try adjusting your search terms to find your events."
                    : "Start exploring and registering for events that interest you."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setActiveTab("discover")}>
                    <Search className="h-4 w-4 mr-2" />
                    Discover Events
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Discover Events Tab */}
          <TabsContent value="discover" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search available events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredAvailableEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailableEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showRegistration={true}
                    isRegistered={isUserRegistered(event.id)}
                    onRegister={() => handleRegister(event.id)}
                    isRegistrationLoading={isRegistrationInProgress(event.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchTerm ? "No events found" : "No new events available"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchTerm
                    ? "Try adjusting your search terms to find events."
                    : "Check back later for new events, or you may have already registered for all available events."}
                </p>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Search
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

export default StudentDashboard;