// Simple in-memory database for testing without MongoDB
class InMemoryDB {
  constructor() {
    this.users = [];
    this.events = [];
    this.registrations = [];
    this.nextUserId = 1;
    this.nextEventId = 1;
    this.nextRegistrationId = 1;
  }

  // User methods
  createUser(userData) {
    const user = {
      _id: this.nextUserId.toString(),
      id: this.nextUserId.toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(user);
    this.nextUserId++;
    return user;
  }

  findUserByEmail(email) {
    return this.users.find((user) => user.email === email);
  }

  findUserById(id) {
    return this.users.find((user) => user._id === id || user.id === id);
  }

  // Event methods
  createEvent(eventData) {
    const event = {
      _id: this.nextEventId.toString(),
      id: this.nextEventId.toString(),
      ...eventData,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.events.push(event);
    this.nextEventId++;
    return event;
  }

  findEventById(id) {
    return this.events.find((event) => event._id === id || event.id === id);
  }

  findEvents(filter = {}) {
    let filteredEvents = [...this.events];

    if (filter.status) {
      filteredEvents = filteredEvents.filter(
        (event) => event.status === filter.status
      );
    }

    if (filter.organizerId) {
      filteredEvents = filteredEvents.filter(
        (event) => event.organizerId === filter.organizerId
      );
    }

    if (filter.isPublic !== undefined) {
      filteredEvents = filteredEvents.filter(
        (event) => event.isPublic === filter.isPublic
      );
    }

    return filteredEvents;
  }

  updateEvent(id, updateData) {
    const eventIndex = this.events.findIndex(
      (event) => event._id === id || event.id === id
    );
    if (eventIndex !== -1) {
      this.events[eventIndex] = {
        ...this.events[eventIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      return this.events[eventIndex];
    }
    return null;
  }

  deleteEvent(id) {
    const eventIndex = this.events.findIndex(
      (event) => event._id === id || event.id === id
    );
    if (eventIndex !== -1) {
      this.events.splice(eventIndex, 1);
      return true;
    }
    return false;
  }

  // Registration methods
  createRegistration(registrationData) {
    const registration = {
      _id: this.nextRegistrationId.toString(),
      id: this.nextRegistrationId.toString(),
      ...registrationData,
      registeredAt: new Date().toISOString(),
    };
    this.registrations.push(registration);
    this.nextRegistrationId++;
    return registration;
  }

  findRegistrationByUserAndEvent(userId, eventId) {
    return this.registrations.find(
      (reg) =>
        reg.userId === userId &&
        reg.eventId === eventId &&
        reg.status === "registered"
    );
  }

  findRegistrationsByUser(userId) {
    return this.registrations.filter(
      (reg) => reg.userId === userId && reg.status === "registered"
    );
  }

  updateRegistration(userId, eventId, updateData) {
    const regIndex = this.registrations.findIndex(
      (reg) => reg.userId === userId && reg.eventId === eventId
    );
    if (regIndex !== -1) {
      this.registrations[regIndex] = {
        ...this.registrations[regIndex],
        ...updateData,
      };
      return this.registrations[regIndex];
    }
    return null;
  }

  deleteRegistrationsByEvent(eventId) {
    this.registrations = this.registrations.filter(
      (reg) => reg.eventId !== eventId
    );
  }
}

// Create singleton instance
const inMemoryDB = new InMemoryDB();

export default inMemoryDB;
