using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class YahooResponse
{
    [Required]
    [JsonPropertyName("chart")]
    public YahooChart Chart { get; set; }
}

public class YahooChart
{
    [Required]
    [JsonPropertyName("result")]
    public List<YahooResult> Result { get; set; }
}

public class YahooResult
{
    [Required]
    [JsonPropertyName("meta")]
    public YahooMeta Meta { get; set; }
   
    [Required]
    [JsonPropertyName("timestamp")]
    public List<long> Timestamp { get; set; }
    
    [Required]
    [JsonPropertyName("indicators")]
    public YahooIndicators Indicators { get; set; }
}

public class YahooMeta
{
    [Required]
    [JsonPropertyName("symbol")]
    public string Symbol { get; set; }
}

public class YahooIndicators
{
    [Required]
    [JsonPropertyName("quote")]
    public List<YahooQuote> Quote { get; set; }
}

public class YahooQuote
{
    [Required]
    [JsonPropertyName("open")]
    public List<decimal?> Open { get; set; }
    
    [Required]
    [JsonPropertyName("high")]
    public List<decimal?> High { get; set; }
    
    [Required]
    [JsonPropertyName("low")]
    public List<decimal?> Low { get; set; }
    
    [Required]
    [JsonPropertyName("close")]
    public List<decimal?> Close { get; set; }

    [Required]
    [JsonPropertyName("volume")]
    public List<long?> Volume { get; set; }
}