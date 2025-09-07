import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, Save, X } from 'lucide-react';

interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  isPublic: boolean;
}

interface EventFormProps {
  event?: Event;
  onSubmit: (eventData: Omit<Event, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 50,
    isPublic: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        capacity: event.capacity,
        isPublic: event.isPublic,
      });
    }
  }, [event]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Event time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Event location is required';
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    } else if (formData.capacity > 1000) {
      newErrors.capacity = 'Capacity cannot exceed 1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isPublic: checked }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          {event ? 'Edit Event' : 'Create New Event'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Event Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              className={errors.title ? 'border-danger' : ''}
            />
            {errors.title && (
              <p className="text-danger text-sm">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your event..."
              rows={4}
              className={errors.description ? 'border-danger' : ''}
            />
            {errors.description && (
              <p className="text-danger text-sm">{errors.description}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                Date *
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className={errors.date ? 'border-danger' : ''}
              />
              {errors.date && (
                <p className="text-danger text-sm">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1 text-primary" />
                Time *
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                className={errors.time ? 'border-danger' : ''}
              />
              {errors.time && (
                <p className="text-danger text-sm">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              Location *
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Event location or venue"
              className={errors.location ? 'border-danger' : ''}
            />
            {errors.location && (
              <p className="text-danger text-sm">{errors.location}</p>
            )}
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-1 text-primary" />
              Capacity *
            </Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              max="1000"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="Maximum attendees"
              className={errors.capacity ? 'border-danger' : ''}
            />
            {errors.capacity && (
              <p className="text-danger text-sm">{errors.capacity}</p>
            )}
          </div>

          {/* Public Event Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="isPublic" className="text-sm">
              Make this event public (visible to all users)
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 sm:flex-initial"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-initial"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;