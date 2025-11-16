# Use a standard, official Java 17 image
FROM eclipse-temurin:17-jdk-jammy

# Set a working directory inside the container
WORKDIR /app

# Copy the Maven wrapper files
COPY .mvn/ .mvn
COPY mvnw .
COPY pom.xml .

# Grant execute permission to the mvnw script
RUN chmod +x ./mvnw

# Download dependencies (this layer is cached)
RUN ./mvnw dependency:go-offline

# Copy the rest of your source code
COPY src ./src

# Build the application
RUN ./mvnw package -DskipTests

# Expose the port your app runs on
EXPOSE 8080

# The command to run your application
CMD ["java", "-jar", "target/user-registration-0.0.1-SNAPSHOT.jar"]