using System.ComponentModel.DataAnnotations;

namespace StockDataApp.Server
{
    public class StockDataPoint
    {
        [Required]
        public DateOnly Date { get; set; }
        [Required]
        public decimal Open { get; set; }
        [Required]
        public decimal High { get; set; }
        [Required]
        public decimal Low { get; set; }
        [Required]
        public decimal Close { get; set; }
        [Required]
        public long Volume { get; set; }

    }
}
