namespace StockDataApp.Server
{
    public class StockData
    {
        public String Symbol { get; set; } = "";
        public List<StockDataPoint> Data { get; set; } = [];
    }
}
