FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

RUN chmod +x mvnw

RUN ./mvnw -q -DskipTests dependency:go-offline

COPY src src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar

ENV SERVER_PORT=9001

EXPOSE 9001

CMD ["java", "-jar", "/app/app.jar"]
