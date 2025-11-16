# FloginFE_BE - Login & Product Management System

## Project Structure

```
FloginFE_BE/
├── frontend/           - React Application
│   ├── src/
│   │   ├── components/ - Login, Product components
│   │   ├── services/   - API services
│   │   ├── utils/      - Validation utilities
│   │   └── __tests__/  - Test files
│   └── package.json
│
└── backend/            - Spring Boot API
    ├── src/
    │   ├── main/java/com/flogin/
    │   │   ├── controller/    - AuthController, ProductController
    │   │   ├── service/       - Business logic
    │   │   ├── dto/           - Data Transfer Objects
    │   │   ├── model/         - Database entities (renamed from entity/)
    │   │   └── repository/    - Data access
    │   └── test/java/         - Test files
    └── pom.xml
```

## Technologies Used

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database
- Maven

### Frontend
- React
- Axios (API calls)
- Jest & React Testing Library
- Cypress (E2E testing)

## Getting Started

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Package Structure

The backend uses `com.flogin` as the base package name, containing:
- **controller/** - REST API endpoints
- **service/** - Business logic layer
- **dto/** - Data Transfer Objects
- **model/** - JPA entities
- **repository/** - Data access layer
