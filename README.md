# Deep Purple

This repository contains the backend for the **Deep Purple** project, a text analysis software that deciphers emotions in client communications. The backend is built using Spring Boot and connects to a PostgreSQL database.

## Features

- RESTful API for managing communications.
- Database connectivity with PostgreSQL. (Temporarily, in the later phase we can move to RDS)
- Hibernate for ORM support.
- Caching support using Caffeine.
- Reactive programming support with Spring WebFlux.
- gpt-4o-mini API for analysis.

## Getting Started

### Prerequisites

- Java 23 or higher
- Maven
- PostgreSQL

### Configuration

1. Clone the repository:

   ```bash
   git clone https://github.com/zylimz107/deeppurple.git
   cd deeppurple/backend

2. If using Open IntelliJ IDEA.
Import the Project:
Click on "Open" and select the directory of your Spring Boot project (the one containing the pom.xml file).


3. Database Setup:

Ensure that you have PostgreSQL installed and running. Create a database named deeppurple and update the database credentials in src/main/resources/application.properties:

It should look like this:
spring.application.name=backend
spring.datasource.url=jdbc:postgresql://localhost:5432/deeppurple
spring.datasource.username=yourpostgresUsername
spring.datasource.password=YourPasswordHere 
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.cache.caffeine.spec=maximumSize=100, expireAfterAccess=10m
logging.level.org.springframework.cache=DEBUG

4. Set Up OpenAI API Key:

Add my OpenAI API key(**ask me when you want to set up, or you can use your own if you have**) to your environment variables: 
if using intelliJ, go to run > Edit Configurations: look for Environment Variables: Paste"OPENAI_API_KEY= (openai key here) ". 

5. Build the Project
Maven Tool Window:

Open the Maven tool window (View > Tool Windows > Maven).
You should see your project listed there.
Build the Project:

In the Maven tool window, navigate to:
Lifecycle > clean
Right-click on clean and select Run. This removes previous build artifacts.
Do the same for install:
Lifecycle > install
Right-click on install and select Run. This will compile the code and package the application.

If using terminal and not IDE: mvn clean install

6. Run BackendApplication.java on intelliJ

If using terminal and not IDE: mvn spring-boot:run

7. If you are familiar with postman, you can test it with the address: http://localhost:8080/api/communications.
Use a json for POST method, example:
{
    "content": "I am happy!"
}

8. Else, you can setup the simple react provided:
   
**Frontend Instructions**
Note that this frontend is just for testing purposes, there is no aesthetic consideration or extra functionality.

Install dependencies: Navigate to the frontend folder and install the required dependencies:

npm install

Start the React frontend: Run the following command to start the frontend:


npm start

Operations:

Save: Input content and select the "Save" operation to store a new communication.

Update: Provide the communication ID and new content to update an existing communication.

Delete: Enter the communication ID to delete a specific communication.

Get by ID: Fetch a communication by its ID and view the emotional analysis results.

Get All: Retrieve and display all communications stored in the backend.

Ensure that the backend is running and accessible at http://localhost:8080 for proper communication with the React frontend.







