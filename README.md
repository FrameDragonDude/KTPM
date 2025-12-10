# FloginFE_BE - Hệ thống Quản Lý Đăng Nhập & Sản Phẩm

## Cấu trúc dự án
```
FloginFE_BE/
├── frontend/           - Ứng dụng React
│   │   ├── components/ - Các component: Đăng nhập, Quản lý sản phẩm
│   │   ├── services/   - Dịch vụ gọi API
│   │   ├── utils/      - Hàm kiểm tra dữ liệu
│   └── package.json
│
└── backend/            - API Spring Boot
    ├── src/
    │   ├── main/java/com/flogin/
    │   │   ├── controller/    - Controller: Auth, Product
    │   │   ├── service/       - Xử lý nghiệp vụ
    │   │   ├── dto/           - Đối tượng truyền dữ liệu
    │   │   ├── model/         - Entity JPA (CSDL)
    │   │   └── repository/    - Truy xuất dữ liệu
    │   └── test/java/         - File kiểm thử
    └── pom.xml
## Công nghệ sử dụng

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (CSDL trong bộ nhớ)
- Maven

### Frontend
- React
- Axios (gọi API)
- Jest & React Testing Library (kiểm thử)
- Cypress (kiểm thử end-to-end)

## Hướng dẫn chạy dự án
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
##Cypress
```bash
npx cypress open
pnpm cypress open
```
## Cấu trúc package backend

Backend sử dụng package gốc `com.flogin` gồm các thư mục:
- **controller/** - Định nghĩa các API REST
- **service/** - Xử lý nghiệp vụ
- **dto/** - Đối tượng truyền dữ liệu
- **model/** - Entity JPA (CSDL)
- **repository/** - Truy xuất dữ liệu
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
