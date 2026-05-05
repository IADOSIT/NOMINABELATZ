FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos de proyecto para restaurar dependencias
COPY ImperhaNomninas.sln .
COPY src/Aplicacion/ImperhaNomninas.Aplicacion.Contratos/ImperhaNomninas.Aplicacion.Contratos.csproj \
     src/Aplicacion/ImperhaNomninas.Aplicacion.Contratos/
COPY src/Dominio/ImperhaNomninas.Dominio.Compartido/ImperhaNomninas.Dominio.Compartido.csproj \
     src/Dominio/ImperhaNomninas.Dominio.Compartido/
COPY src/Dominio/ImperhaNomninas.Dominio/ImperhaNomninas.Dominio.csproj \
     src/Dominio/ImperhaNomninas.Dominio/
COPY src/Infraestructura/ImperhaNomninas.Infraestructura.Persistencia/ImperhaNomninas.Infraestructura.Persistencia.csproj \
     src/Infraestructura/ImperhaNomninas.Infraestructura.Persistencia/
COPY src/Presentacion/ImperhaNomninas.Api/ImperhaNomninas.Api.csproj \
     src/Presentacion/ImperhaNomninas.Api/

RUN dotnet restore src/Presentacion/ImperhaNomninas.Api/ImperhaNomninas.Api.csproj

# Copiar el resto del código fuente y publicar
COPY src/ src/

RUN dotnet publish src/Presentacion/ImperhaNomninas.Api/ImperhaNomninas.Api.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5000
ENTRYPOINT ["dotnet", "ImperhaNomninas.Api.dll"]
