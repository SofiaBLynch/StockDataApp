using System.ComponentModel.DataAnnotations;

namespace StockDataApp.Server
{
    public class StockData
    {
        [Required]
        public String Symbol { get; set; } = "";
        [Required]
        public List<StockDataPoint> Data { get; set; } = [];
    }
}
