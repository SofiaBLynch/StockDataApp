using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace StockDataApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StockDataController : ControllerBase
    {
        private readonly IStockService _stockService;
        private readonly ILogger<StockDataController> _logger;

        public StockDataController(IStockService stockService, ILogger<StockDataController> logger)
        {
            _stockService = stockService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string symbol)
        {
            if (string.IsNullOrWhiteSpace(symbol))
            {
                return BadRequest("A stock symbol is required.");
            }

            try
            {
                var data = await _stockService.GetStockDataAsync(symbol);
                return data is null ? NotFound("No stock data found.") : Ok(data);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Failed to fetch stock data for {Symbol}", symbol);
                return StatusCode(502, "Failed to retrieve data from upstream provider.");
            }
        }
    }
}