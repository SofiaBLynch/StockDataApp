# AI Prompt Log

## 1. Connecting the StockDataController to an External API

**Prompt sent:**
How can I modify the StockDataController to connect to and call an external API?

**Why I chose this prompt:**
I had already setup the controller and confirmed the frontend was rendering dummy data
correctly. The next step was connecting to a real data source, and I wanted a starting point for
the HttpClient pattern in ASP.NET Core.

**What the AI returned:**
A template HttpGet method using `HttpClient`, a URL variable, and an async request/response
pattern.

**What I kept:**
The general async HttpClient structure and IActionResult return pattern.

**What I changed / added manually:**
- Added the `User-Agent` header (`Mozilla/5.0 ...`) as specified in the assessment
  documentation — the AI omitted this and Yahoo's API requires it
- Customized the endpoint to query Yahoo Finance for the past month of daily data
  (`interval=1d&range=1mo`)
- Added `[FromQuery] string symbol` as a parameter so the endpoint accepts a dynamic
  stock symbol rather than a hardcoded one
- Added input validation to return a 400 if no symbol is provided

---

## 2. Separating HttpClient Management into a Service

**Prompt sent:**
 How can the HTTP client connection be separated out to be independently handled and 
 then called from the GET method, instead of creating a new HTTP client on every request?

**Why I chose this prompt:**
The original organization had HttpClient directly inside the controller and was being created on every request.
I wanted to restructure to just setup the client initally and the call with new requests, instead of 
creating the client every request because then it doesn't reuse connections and can exhaust resources. I wanted
to apply the correct .NET pattern and also separate concerns so the controller wasn't
responsible for both HTTP logic and request handling.

**What the AI returned:**
An explanation of extracting the logic into a dedicated service class, registering a named
`HttpClient` via `IHttpClientFactory` in `Program.cs`, and injecting the service into the
controller.

**What I kept:**
- The `IHttpClientFactory` pattern with a named client registered in `Program.cs`
- The service interface / implementation split for testability and clean architecture

**What I added manually:**
- Created a dedicated `Services/` folder to house the interface and implementation,
  keeping the project structure organized for future growth
- The service handles the full lifecycle: creating the Yahoo client, making the request,
  deserializing the response, and mapping it to `StockData`

**Why this matters beyond the immediate fix:**
This separation sets the project up well for extensibility. If the requirement grows to
support multiple data providers (e.g. comparing Yahoo Finance against another source),
the controller stays untouched and only a new service implementation would be needed.

---
## 3. Formatting Large Volume Values on the Y-Axis

**Prompt sent:**
Create a volume formatter for the MUI X LineChart Y-axis tick marks that compacts 
large numbers (e.g. 90,000,000 should display as 90M)

**Why I chose this prompt:**
Volume values for stocks can range from thousands to hundreds of millions. Rendering raw
numbers like 90,000,000 on a chart axis makes the ticks unreadable and clutters the UI.
I needed a concise formatter to improve readability without losing meaning.

**What the AI returned:**
A JavaScript formatter function using threshold checks to append K, M, or other suffixes
and divide the value accordingly.

**What I kept:**
The core logic was straightforward and correct for the use case.

**What I evaluated:**
I verified the formatter handled edge cases that matter for stock volume for different stocks in the thousands
and millions.

**What I changed / added manually:**
No changes seemed to apply for this situation.

---

## 4. Adding Titles to the Charts

**Prompt sent:**
How do I add a title to the mui charts?

**Why I chose this prompt:**
The charts rendered without any label identifying what stock or metric was being shown.
I wanted to confirm whether MUI X Charts had a title prop before reaching for
a workaround.

**What the AI returned:**
Three options: a plain HTML heading, MUI `<Typography>`, or a wrapping div with a
custom heading. It also suggested dynamically binding the title to `stockData.symbol`
so it updates automatically when the user searches a new ticker.

**What I kept:**
I added in plain HTML headings to be consistent with the other headings on the page. The headings
are currently h4 tags with static text as the charts are the same regardless of the stock chosen.

**What I noted:**
The AI confirmed MUI X Charts has no built-in `title` prop, which saved me from
searching the docs. 

---
## 5. Deserializing the Yahoo Finance API Response

**Prompt sent:**
Here is the raw JSON response from the Yahoo Finance API. Can you create C# model
classes to deserialize it? I only need the following fields: symbol, open, high,
low, close, volume, and the timestamps.

**Why I chose this prompt:**
The Yahoo Finance API returns a deeply nested JSON structure with more data than
needed. Rather than writing all the intermediate wrapper classes by hand, I gave the AI
the raw response and specified exactly which fields I needed so it wouldn't generate
models for data I wasn't using.

**What the AI returned:**
C# model classes covering the full nested structure required to reach the target fields —
YahooResponse, Chart, ChartResult, Indicators, Quote, and Meta — with properties
matching the JSON keys.

**What I kept:**
The generated classes as-is. By being specific upfront about which fields I needed,
the output was already scoped correctly and mapped cleanly to what the StockData
expected — no unnecessary properties and no renaming required. I only added in the Required 
DataAnnotation for the fields to ensure those were properly documented.

---
## 6. Generating the README

**Prompt sent:**
> Generate a README for my project with the following details:
> - Frontend runs at localhost:64085, backend/Swagger at http://localhost:5046/swagger/index.html
> - Run by cloning the repo, cd into StockDataApp.Server, and running dotnet run
> - Tech stack: React, MUI X Charts, Material UI, Day.js on the frontend;
>   ASP.NET Core 8, C#, Swagger on the backend; Yahoo Finance API as the data source
> - Features: stock symbol search, 1 month of historical data, price and volume
>   line charts, data table, error handling

**Why I chose this prompt:**
A clear README is a deliverable requirement. By providing the exact URLs, run command,
tech stack, and feature list upfront, I could get a well-structured output without
back-and-forth and then review it for accuracy rather than writing boilerplate from scratch.

**What the AI returned:**
A complete README with sections for overview, features, tech stack, prerequisites,
setup instructions, application URLs, usage steps, and project structure.

**What I reviewed and kept:**
Read through the full output and verified all URLs, commands, and tech stack entries
were accurate before submitting. The structure and wording were clean and required
no changes.
