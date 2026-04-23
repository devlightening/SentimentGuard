FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SentimentGuard.Api/SentimentGuard.Api.csproj", "SentimentGuard.Api/"]
COPY ["SentimentGuard.Application/SentimentGuard.Application.csproj", "SentimentGuard.Application/"]
COPY ["SentimentGuard.Domain/SentimentGuard.Domain.csproj", "SentimentGuard.Domain/"]
COPY ["SentimentGuard.Infrastructure/SentimentGuard.Infrastructure.csproj", "SentimentGuard.Infrastructure/"]
RUN dotnet restore "SentimentGuard.Api/SentimentGuard.Api.csproj"
COPY . .
RUN dotnet build "SentimentGuard.Api/SentimentGuard.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SentimentGuard.Api/SentimentGuard.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SentimentGuard.Api.dll"]
