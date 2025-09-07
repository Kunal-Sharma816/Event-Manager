import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventsAPI } from '../../api/events';
import { Event, CreateEventData, UpdateEventData, ApiError } from '../../types';

interface EventsState {
  events: Event[];
  userEvents: Event[];
  registeredEvents: Event[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  userEvents: [],
  registeredEvents: [],
  isLoading: false,
  error: null,
};

// Helper function to handle API errors
const handleApiError = (error: unknown): string => {
  const apiError = error as ApiError;
  return apiError.response?.data?.message || apiError.message || 'An error occurred';
};

// Async thunks
export const fetchPublicEvents = createAsyncThunk(
  'events/fetchPublic',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.getPublicEvents();
      return response.events;
    } catch (error: unknown) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchAllEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.getAllEvents();
      return response.events;
    } catch (error: unknown) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchUserEvents = createAsyncThunk(
  'events/fetchUserEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.getUserEvents();
      return response.events;
    } catch (error: unknown) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchRegisteredEvents = createAsyncThunk(
  'events/fetchRegistered',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.getRegisteredEvents();
      return response.events;
    } catch (error: unknown) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData: CreateEventData, { rejectWithValue }) => {
    try {
      console.log('Creating event with data:', eventData);
      const response = await eventsAPI.createEvent(eventData);
      console.log('Event created successfully:', response);
      return response.event;
    } catch (error: unknown) {
      console.error('Error creating event:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, eventData }: { id: string; eventData: UpdateEventData }, { rejectWithValue }) => {
    try {
      console.log('Updating event:', id, eventData);
      const response = await eventsAPI.updateEvent(id, eventData);
      return response.event;
    } catch (error: unknown) {
      console.error('Error updating event:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await eventsAPI.deleteEvent(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const approveEvent = createAsyncThunk(
  'events/approve',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.approveEvent(id);
      return response.event;
    } catch (error: unknown) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const rejectEvent = createAsyncThunk(
  'events/reject',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.rejectEvent(id);
      return response.event;
    } catch (error: unknown) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const registerForEvent = createAsyncThunk(
  'events/register',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.registerForEvent(eventId);
      return { eventId, message: response.message };
    } catch (error: unknown) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch public events
      .addCase(fetchPublicEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(fetchPublicEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch all events
      .addCase(fetchAllEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch user events
      .addCase(fetchUserEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userEvents = action.payload;
        state.error = null;
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch registered events
      .addCase(fetchRegisteredEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRegisteredEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registeredEvents = action.payload;
        state.error = null;
      })
      .addCase(fetchRegisteredEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userEvents.unshift(action.payload); // Add to beginning of array
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.userEvents.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.userEvents[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userEvents = state.userEvents.filter(event => event.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Approve/Reject events
      .addCase(approveEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(rejectEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      // Register for event
      .addCase(registerForEvent.pending, (state) => {
        // Don't set global loading for registration as it's handled per-event
        state.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        console.log('Registration successful:', action.payload.message);
        state.error = null;
        
        // Optionally update the registered count for the event in the public events list
        const { eventId } = action.payload;
        const eventIndex = state.events.findIndex(event => event.id === eventId);
        if (eventIndex !== -1) {
          state.events[eventIndex].registeredCount = (state.events[eventIndex].registeredCount || 0) + 1;
        }
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = eventsSlice.actions;
export default eventsSlice.reducer;