# Event Management API

The **Event Management API** is a backend system designed to handle event management operations, including event creation, attendee registration, email notifications, real-time updates, and more. Built using **NestJS**, it leverages modern tools like **Prisma** for database management, **BullJS** for job processing, **Redis** for caching, and **WebSocket** for real-time notifications.

---

## **Features**

- **CRUD Operations** for Events and Attendees
- Robust Registration System with Capacity Management
- Scheduled Email Notifications (using **Nodemailer**)
- Real-time Notifications with **WebSocket**
- Caching with **Redis**
- Task Scheduling with **@nestjs/schedule**
- Dockerized Setup for Consistent Development and Deployment
- Comprehensive Swagger API Documentation

---

## **Setup Instructions**

### **Prerequisites**

1. **Docker** and **Docker Compose**
2. **pnpm** (installed globally: `npm install -g pnpm`)

---

### **Local Development Setup**

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Ensure that PostgreSQL and Redis are running locally.
   Use Docker Compose for convenience (see Docker Setup below).

4. Run database migrations:

   ```bash
   pnpm prisma migrate dev
   ```

5. Start the development server:

   ```bash
   pnpm start:dev
   ```

6. Access the API at:

   ```
   http://localhost:3000
   ```

7. Access Swagger API Documentation at:
   ```
   http://localhost:3000/api-docs
   ```

---

### **Docker Setup**

1. Build and run the Docker containers:

   ```bash
   docker-compose up --build
   ```

2. The API will be available at:

   ```
   http://localhost:3000
   ```

3. The PostgreSQL database will be available at:

   ```
   localhost:5432
   ```

   with credentials:

   - **User**: `postgres`
   - **Password**: `postgres`
   - **Database**: `event_management`

4. Redis will be available at:
   ```
   localhost:6379
   ```

---

## **Environment Variables**

Configure the following environment variables in your `.env` file:
If you have enabled 2-Step Verification on your Google account, you can generate an App Password to use SMTP for email notifications.
Use your full Gmail address as the value for SMTP_USER.

| Variable                  | Description                    | Default Value                                                                  |
| ------------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `DATABASE_URL`            | PostgreSQL database connection | `postgresql://postgres:postgres@localhost:5432/event_management?schema=public` |
| `REDIS_HOST`              | Redis host                     | `localhost`                                                                    |
| `REDIS_PORT`              | Redis port                     | `6379`                                                                         |
| `SMTP_HOST`               | SMTP server host               | `smtp.gmail.com`                                                               |
| `SMTP_PORT`               | SMTP server port               | `587`                                                                          |
| `SMTP_USER`               | SMTP username                  |                                                                                |
| `SMTP_PASS`               | SMTP password                  |                                                                                |
| `NODE_ENV`                | Environment (development/test) | `development`                                                                  |
| `CACHE_TTL`               | Cache TTL in seconds           | `3600`                                                                         |
| `MINIMUM_SPOTS_THRESHOLD` | Notify for remaining spots     | `3`                                                                            |

---

## **API Endpoints**

### **Events**

- **Create Event**

  ```http
  POST /api/events
  Content-Type: application/json

  {
    "name": "Tech Conference 2024",
    "date": "2024-12-30T15:00:00.000Z",
    "max_attendees": 100
  }
  ```

- **List Events**

  ```http
  GET /api/events
  ```

- **Get Event by ID**

  ```http
  GET /api/events/:id
  ```

- **Update Event**

  ```http
  PATCH /api/events/:id
  Content-Type: application/json

  {
    "name": "Updated Conference Name",
    "max_attendees": 150
  }
  ```

- **Delete Event**
  ```http
  DELETE /api/events/:id
  ```

---

### **Attendees**

- **Create Attendee**

  ```http
  POST /api/attendees
  Content-Type: application/json

  {
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
  ```

- **List Attendees**
  ```http
  GET /api/attendees
  ```

---

### **Registrations**

- **Register Attendee for Event**

  ```http
  POST /api/registrations
  Content-Type: application/json

  {
    "event_id": "event_id_here",
    "attendee_id": "attendee_id_here"
  }
  ```

- **List Registrations for Event**

  ```http
  GET /api/registrations/:event_id
  ```

- **Cancel Registration**
  ```http
  DELETE /api/registrations/:registration_id
  ```

---

### **Real-Time Notifications**

- **WebSocket Connection**
  Connect to:

  ```
  ws://localhost:3000
  ```

- **Notifications**:

  - **`newEvent`**: Triggered when a new event is created.

    ```json
    {
      "type": "newEvent",
      "data": {
        "name": "Tech Conference 2024",
        "date": "2024-12-30T15:00:00.000Z"
      }
    }
    ```

  - **`spotsFillingUp`**: Triggered when spots for an event are nearly full.
    ```json
    {
      "type": "spotsFillingUp",
      "data": {
        "eventName": "Tech Conference 2024",
        "remainingSpots": 2
      }
    }
    ```

---

## **Tech Stack**

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Job Queue**: BullJS
- **Real-Time Communication**: WebSocket
- **Task Scheduling**: @nestjs/schedule
- **Containerization**: Docker
- **Package Manager**: pnpm

---

## **Development Notes**

1. **Prisma Migrations**:
   Run database migrations with:

   ```bash
   pnpm prisma migrate dev
   ```

2. **Linting and Formatting**:

   - Lint code with:
     ```bash
     pnpm lint
     ```
   - Format code with:
     ```bash
     pnpm format
     ```
