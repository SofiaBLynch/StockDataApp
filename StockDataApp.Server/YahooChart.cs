using System.Text.Json.Serialization;

public class YahooResponse
{
    [JsonPropertyName("chart")]
    public YahooChart Chart { get; set; }
}

public class YahooChart
{
    [JsonPropertyName("result")]
    public List<YahooResult> Result { get; set; }
}

public class YahooResult
{
    [JsonPropertyName("meta")]
    public YahooMeta Meta { get; set; }

    [JsonPropertyName("timestamp")]
    public List<long> Timestamp { get; set; }

    [JsonPropertyName("indicators")]
    public YahooIndicators Indicators { get; set; }
}

public class YahooMeta
{
    [JsonPropertyName("symbol")]
    public string Symbol { get; set; }
}

public class YahooIndicators
{
    [JsonPropertyName("quote")]
    public List<YahooQuote> Quote { get; set; }
}

public class YahooQuote
{
    [JsonPropertyName("open")]
    public List<decimal?> Open { get; set; }

    [JsonPropertyName("high")]
    public List<decimal?> High { get; set; }

    [JsonPropertyName("low")]
    public List<decimal?> Low { get; set; }

    [JsonPropertyName("close")]
    public List<decimal?> Close { get; set; }

    [JsonPropertyName("volume")]
    public List<long?> Volume { get; set; }
}