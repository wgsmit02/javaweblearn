# ============================================================
# Stage 1: BUILD
# Uses the official Maven image which includes JDK 21 and Maven 3.9
# This stage compiles the code and packages it into a .jar file
# ============================================================
FROM maven:3.9-eclipse-temurin-21 AS builder

# Set the working directory inside the container
WORKDIR /build

# Copy the pom.xml first — Docker caches layers.
# If pom.xml hasn't changed, Maven won't re-download all dependencies on the next build.
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Now copy the source code and build the application
COPY src ./src
RUN mvn package -DskipTests -q

# ============================================================
# Stage 2: RUN
# Uses a minimal JRE-only image — no compiler, no Maven, no source code
# Results in a much smaller and more secure final image
# ============================================================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Create a non-root user to run the application
# Running as root inside a container is a security risk
RUN groupadd --system appgroup && useradd --system --gid appgroup appuser

# Copy only the compiled .jar from the builder stage
COPY --from=builder /build/target/*.jar app.jar

# Give ownership to the non-root user
RUN chown appuser:appgroup app.jar

USER appuser

# The port Spring Boot listens on (matches server.port in application.properties)
EXPOSE 8080

# Health check — Docker will ping this to know if the container is healthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
