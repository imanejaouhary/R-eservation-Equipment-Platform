# Multi‑stage build for the user‑service
# ---------- Builder stage ----------
FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Download dependencies (uses the wrapper if present, otherwise Maven defaults)
RUN mvn -B dependency:go-offline
# Package the application (skip tests for speed in Docker build)
RUN mvn -B package -DskipTests

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app/app.jar"]
