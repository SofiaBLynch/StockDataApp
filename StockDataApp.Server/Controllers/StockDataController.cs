using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace StockDataApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StockDataController : ControllerBase
    {
        private readonly ILogger<StockDataController> _logger;

        public StockDataController(ILogger<StockDataController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string symbol)
        {
            if (string.IsNullOrWhiteSpace(symbol))
            {
                return BadRequest("A stock symbol is required.");
            }

            using var client = new HttpClient();

            client.DefaultRequestHeaders.UserAgent.ParseAdd(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            var url =
                $"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1mo";

            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode);
            }

            var json = await response.Content.ReadAsStringAsync();

            var yahoo = JsonSerializer.Deserialize<YahooResponse>(json);

            if (yahoo?.Chart?.Result == null || yahoo.Chart.Result.Count == 0)
            {
                return NotFound("No stock data found.");
            }

            var result = yahoo.Chart.Result[0];
            var quote = result.Indicators.Quote[0];

            var stockData = new StockData
            {
                Symbol = result.Meta.Symbol,
                Data = new List<StockDataPoint>()
            };

            for (int i = 0; i < result.Timestamp.Count; i++)
            {
                stockData.Data.Add(new StockDataPoint
                {
                    Date = DateOnly.FromDateTime(
                        DateTimeOffset
                            .FromUnixTimeSeconds(result.Timestamp[i])
                            .DateTime),

                    Open = quote.Open[i] ?? 0,
                    High = quote.High[i] ?? 0,
                    Low = quote.Low[i] ?? 0,
                    Close = quote.Close[i] ?? 0,
                    Volume = quote.Volume[i] ?? 0
                });
            }

            return Ok(stockData);
        }
    }
}