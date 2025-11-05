# Product Management System

## Overview
The Product Management System is a full-stack application designed to manage products efficiently. It consists of a backend built with Spring Boot and a frontend developed using standard web technologies.

## Project Structure
The project is organized into two main modules: `backend` and `frontend`.

```
product-management-system
├── backend
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com
│   │   │   │       └── productmanagement
│   │   │   │           ├── ProductManagementApplication.java
│   │   │   │           ├── controller
│   │   │   │           │   └── ProductController.java
│   │   │   │           ├── service
│   │   │   │           │   ├── ProductService.java
│   │   │   │           │   └── impl
│   │   │   │           │       └── ProductServiceImpl.java
│   │   │   │           ├── repository
│   │   │   │           │   └── ProductRepository.java
│   │   │   │           ├── model
│   │   │   │           │   └── Product.java
│   │   │   │           └── dto
│   │   │   │               └── ProductDTO.java
│   │   │   └── resources
│   │   │       ├── application.properties
│   │   │       └── application.yml
│   │   └── test
│   │       └── java
│   │           └── com
│   │               └── productmanagement
│   │                   ├── controller
│   │                   │   └── ProductControllerTest.java
│   │                   └── service
│   │                       └── ProductServiceTest.java
│   └── pom.xml
├── frontend
│   ├── src
│   │   ├── main
│   │   │   ├── webapp
│   │   │   │   ├── WEB-INF
│   │   │   │   │   └── web.xml
│   │   │   │   ├── index.html
│   │   │   │   ├── css
│   │   │   │   │   └── styles.css
│   │   │   │   └── js
│   │   │   │       └── app.js
│   │   │   └── resources
│   │   └── test
│   └── pom.xml
├── pom.xml
└── README.md
```

## Backend
The backend is built using Spring Boot and provides RESTful APIs for product management. Key components include:

- **ProductManagementApplication.java**: The entry point of the Spring Boot application.
- **ProductController.java**: Handles HTTP requests related to products.
- **ProductService.java**: Interface defining product operations.
- **ProductServiceImpl.java**: Implements the product service logic.
- **ProductRepository.java**: Interface for CRUD operations on Product entities.
- **Product.java**: Represents the product entity.
- **ProductDTO.java**: Data Transfer Object for product data.
- **application.properties**: Configuration properties for the Spring Boot application.

## Frontend
The frontend is a web application that interacts with the backend APIs. It includes:

- **index.html**: The main HTML file for the frontend application.
- **styles.css**: CSS styles for the frontend application.
- **app.js**: JavaScript code for client-side logic.
- **web.xml**: Deployment descriptor for the web application.

## Setup Instructions
1. Clone the repository.
2. Navigate to the `backend` directory and run `mvn clean install` to build the backend.
3. Navigate to the `frontend` directory and run `mvn clean install` to build the frontend.
4. Start the backend server and access the frontend application in your web browser.

## Usage
Once the application is running, you can manage products through the web interface. You can create, read, update, and delete products using the provided functionalities.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.