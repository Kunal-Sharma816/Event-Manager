import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../components/Navbar";
import {
  Calendar,
  Users,
  BookOpen,
  Settings,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: "Event Management",
      description: "Create, manage, and promote your campus events with ease.",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Student Registration",
      description: "Simple registration process for students to join events.",
      color: "text-success",
    },
    {
      icon: BookOpen,
      title: "Organizer Dashboard",
      description:
        "Comprehensive tools for event organizers to track engagement.",
      color: "text-warning",
    },
    {
      icon: Settings,
      title: "Admin Control",
      description: "Full administrative control with approval workflows.",
      color: "text-accent",
    },
  ];

  const stats = [
    { label: "Active Events", value: "50+", color: "text-primary" },
    { label: "Registered Students", value: "1,200+", color: "text-success" },
    { label: "Event Organizers", value: "85+", color: "text-warning" },
    { label: "Campus Locations", value: "25+", color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Your Campus Event
                <span className="text-primary"> Hub</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover, create, and manage campus events all in one place.
                Connect with your community and make every event memorable.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/events">
                    Explore Events
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Campus Events
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools for students, organizers, and administrators to
              create an engaged campus community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg"
              >
                <CardHeader className="pb-4">
                  <feature.icon className={`h-10 w-10 ${feature.color} mb-3`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get started with campus events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your account and choose your role - Student, Organizer,
                or Admin
              </p>
            </div>

            <div className="text-center">
              <div className="bg-success/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-success">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Discover & Create</h3>
              <p className="text-muted-foreground">
                Browse events or create your own. Get approval and start
                engaging
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Engage</h3>
              <p className="text-muted-foreground">
                Register for events, network with peers, and build community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Sections */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Everyone on Campus
            </h2>
            <p className="text-xl text-muted-foreground">
              Tailored experiences for each role in your campus community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Students */}
            <Card className="border-border hover:border-primary/30 transition-all duration-200">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-xl">For Students</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Discover campus events
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Easy registration process
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Personal event dashboard
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Event reminders & updates
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/register">Join as Student</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Organizers */}
            <Card className="border-border hover:border-accent/30 transition-all duration-200">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-accent mb-3" />
                <CardTitle className="text-xl">For Organizers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Create & manage events
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Track registrations
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Analytics & insights
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Engagement tools
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/register">Become Organizer</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Admins */}
            <Card className="border-border hover:border-warning/30 transition-all duration-200">
              <CardHeader>
                <Settings className="h-8 w-8 text-warning mb-3" />
                <CardTitle className="text-xl">For Admins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Approve/reject events
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    User management
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Platform oversight
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Comprehensive analytics
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/register">Admin Access</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Star className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Campus Events?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students, organizers, and administrators already
              using our platform to create amazing campus experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/register">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8"
              >
                <Link to="/events">Browse Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  CampusEvents
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Your comprehensive platform for discovering, creating, and
                managing campus events. Building stronger campus communities
                through engagement.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/events"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Public Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 mt-8 text-center">
            <p className="text-muted-foreground">© 2025 CampusEvents</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
