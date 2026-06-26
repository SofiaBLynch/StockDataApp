using StockDataApp.Server;

public interface IStockService
{
    Task<StockData?> GetStockDataAsync(string symbol);
}