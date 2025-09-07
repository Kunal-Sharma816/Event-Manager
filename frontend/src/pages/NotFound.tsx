import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center border-border">
          <CardHeader className="pb-8">
            <div className="mx-auto mb-6">
              <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
              <Search className="h-16 w-16 text-muted-foreground mx-auto" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-4">
              Page Not Found
            </CardTitle>
            <p className="text-xl text-muted-foreground">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              You tried to access: <code className="bg-muted px-2 py-1 rounded text-foreground">{location.pathname}</code>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="flex items-center">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/events">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Events
                </Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Looking for something specific? Try these popular pages:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button asChild variant="link" size="sm">
                  <Link to="/events">Public Events</Link>
                </Button>
                <Button asChild variant="link" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="link" size="sm">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
