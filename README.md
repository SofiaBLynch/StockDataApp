# Stock Data App

A full-stack stock tracking application built with **React**, **ASP.NET Core 8**, and the **Yahoo Finance API**. 
The application allows users to search for a stock ticker and view tables with the past months trading data and volume.

## Features

- Search stocks by ticker symbol (e.g., `AAPL`, `TSLA`, `MSFT`)
- View one month of historical stock data
- Interactive line charts displaying:
  - Open, High, Low, and Close prices
  - Daily trading volume
- Expandable/collapsible data table
- Error handling for invalid symbols and server/API issues

## Tech Stack

### Frontend
- React
- MUI X Charts
- Material UI Icons
- Day.js

### Backend
- ASP.NET Core 8 Web API
- C#
- Swagger/OpenAPI

### Data Source
- Yahoo Finance Chart API

## Getting Started

### Prerequisites

Make sure you have the following installed:
- .NET 8 SDK
- Node.js
- Vite v8.1.0

### Running the Application

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate to the server project:

```bash
cd StockDataApp.Server
```

3. Start the application:

```bash
dotnet run
```

Running the ASP.NET Core project will start both the backend API and the React frontend.

## Application URLs

### Frontend

```
https://localhost:64085
```

### Backend API (Swagger)

```
http://localhost:5046/swagger/index.html
```

Swagger can be used to test the API endpoints directly.

## Usage

1. Launch the application.
2. Enter a stock ticker (for example: `AAPL`, `TSLA`, or `NVDA`).
3. Click **Search**.
4. View:
   - Historical stock price chart
   - Trading volume chart

## Project Structure

```
StockDataApp/
├── StockDataApp.Client/     # React frontend
├── StockDataApp.Server/     # ASP.NET Core Web API
└── README.md
```
