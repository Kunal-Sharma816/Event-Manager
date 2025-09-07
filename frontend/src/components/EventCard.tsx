import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  Check, 
  X,
  UserCheck,
  Loader2
} from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateHelpers';

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
}

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  showAdminActions?: boolean;
  showRegistration?: boolean;
  isRegistered?: boolean;
  isRegistrationLoading?: boolean;
  isUnregistrationLoading?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRegister?: (id: string) => void;
  onUnregister?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  showActions = false,
  showAdminActions = false,
  showRegistration = false,
  isRegistered = false,
  isRegistrationLoading = false,
  isUnregistrationLoading = false,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onRegister,
  onUnregister,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return null;
    }
  };

  const isEventFull = event.registeredCount >= event.capacity;
  const availableSpots = event.capacity - event.registeredCount;
  const isLoading = isRegistrationLoading || isUnregistrationLoading;

  // Check if event is in the past
  const eventDateTime = new Date(`${event.date} ${event.time}`);
  const isPastEvent = eventDateTime < new Date();

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
            {event.title}
          </CardTitle>
          <div className="flex flex-col items-end space-y-1">
            {getStatusBadge(event.status)}
            {event.isPublic && (
              <Badge variant="outline" className="text-xs">
                Public
              </Badge>
            )}
            {isPastEvent && (
              <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                Past Event
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {event.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            {formatTime(event.time)}
          </div>
          <div className="flex items-center text-muted-foreground col-span-2">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            {event.location}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span>
              {event.registeredCount} / {event.capacity} registered
            </span>
          </div>
          {!isPastEvent && (
            <>
              {availableSpots > 0 && !isEventFull && (
                <span className="text-green-600 text-xs">
                  {availableSpots} spots left
                </span>
              )}
              {isEventFull && (
                <span className="text-red-600 text-xs font-medium">
                  Event Full
                </span>
              )}
            </>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Organized by {event.organizerName}
        </div>

        {/* Registration Status Indicator */}
        {isRegistered && (
          <div className="flex items-center text-sm text-green-600 bg-green-50 p-2 rounded">
            <UserCheck className="h-4 w-4 mr-2" />
            <span>You're registered for this event</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-border bg-muted/30">
        <div className="flex flex-wrap gap-2 w-full">
          {/* Organizer Actions */}
          {showActions && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(event)}
                className="flex-1 min-w-0"
                disabled={isLoading}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(event.id)}
                className="flex-1 min-w-0 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-1"/>
                Delete
              </Button>
            </>
          )}

          {/* Admin Actions */}
          {showAdminActions && event.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApprove?.(event.id)}
                className="flex-1 min-w-0 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                disabled={isLoading}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject?.(event.id)}
                className="flex-1 min-w-0 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}

          {/* Registration Actions */}
          {showRegistration && event.status === 'approved' && !isPastEvent && (
            <>
              {isRegistered ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUnregister?.(event.id)}
                  className="w-full hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200"
                  disabled={isUnregistrationLoading}
                >
                  {isUnregistrationLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Unregistering...
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-1" />
                      Unregister
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onRegister?.(event.id)}
                  disabled={isEventFull || isRegistrationLoading}
                  className="w-full"
                >
                  {isRegistrationLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-1" />
                      {isEventFull ? 'Event Full' : 'Register'}
                    </>
                  )}
                </Button>
              )}
            </>
          )}

          {/* Past Event Message */}
          {showRegistration && isPastEvent && (
            <div className="w-full text-center py-2 text-sm text-gray-500">
              This event has ended
            </div>
          )}

          {/* Registered but no actions */}
          {!showRegistration && !showActions && !showAdminActions && isRegistered && (
            <div className="w-full text-center py-2 text-sm text-green-600">
              ✓ Registered
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;