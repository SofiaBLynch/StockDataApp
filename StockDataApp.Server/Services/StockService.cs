using StockDataApp.Server;
using System.Text.Json;

public class StockService : IStockService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public StockService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<StockData?> GetStockDataAsync(string symbol)
    {
        var client = _httpClientFactory.CreateClient("Yahoo");
        var response = await client.GetAsync(
            $"v8/finance/chart/{symbol}?interval=1d&range=1mo");

        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var yahoo = JsonSerializer.Deserialize<YahooResponse>(json);

        if (yahoo?.Chart?.Result == null || yahoo.Chart.Result.Count == 0)
            return null;

        var result = yahoo.Chart.Result[0];
        var quote = result.Indicators.Quote[0];

        return new StockData
        {
            Symbol = result.Meta.Symbol,
            Data = result.Timestamp.Select((ts, i) => new StockDataPoint
            {
                Date = DateOnly.FromDateTime(
                    DateTimeOffset.FromUnixTimeSeconds(ts).DateTime),
                Open = quote.Open[i] ?? 0,
                High = quote.High[i] ?? 0,
                Low = quote.Low[i] ?? 0,
                Close = quote.Close[i] ?? 0,
                Volume = quote.Volume[i] ?? 0
            }).ToList()
        };
    }
}