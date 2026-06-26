import { useEffect, useState } from 'react';
import './App.css';
import { LineChart } from '@mui/x-charts/LineChart';

function App() {
    const [stockData, setStockData] = useState();
    const [symbol, setSymbol] = useState("TSLA");
    const [monthHigh, setMonthHigh] = useState([]);
    const [days, setDays] = useState([]);

    useEffect(() => {
        populateStockData();
        createLineChart();
    }, []);

    const dataContents = stockData === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : 
                
        <div key={stockData.symbol}>
            <h3>{stockData.symbol}</h3>
                    <table className="table table-striped" aria-labelledby="tableLabel">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Open</th>
                                <th>High</th>
                                <th>Low</th>
                                <th>Close</th>
                                <th>Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                    {stockData.data.map(data =>
                                <tr key={data.date}>
                                    <td>{data.date}</td>
                                    <td>{data.open}</td>
                                    <td>{data.high}</td>
                                    <td>{data.low}</td>
                                    <td>{data.close}</td>
                                    <td>{data.volume}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        ;            

    return (
        <div>
            <h1 id="tableLabel">Weather forecast</h1>
            <text
                id="errorMessage"
                display="none">
                Error: Invalid stock code
            </text>
            <input name="stockCodeInput"
                placeholder="Input 1-5 length stock"
                minLength={1}
                maxLength={5}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            <button onClick={updateData}>
                Search
            </button>
            <p>This component demonstrates fetching data from the server.</p>
            <br />
            {dataContents}
            <div id="lineGraph" display="none">
                <LineChart
                    series={[{ data: monthHigh }]}
                    xAxis={[{ data: days, dataKey: 'date' }]}
                    width={800}
                    height={400}

                />
            </div>
        </div>
    );
    
    async function populateStockData() {
        console.log("here " + symbol);
        try {
            const response = await fetch(
                `stockdata?symbol=${encodeURIComponent(symbol)}`
            );

            if (response.status == 500) {
                document.getElementById("errorMessage").style.display = "block";
                return;
            } else {
                document.getElementById("errorMessage").style.display = "none"; 
            }
            if (!response.ok) {
                console.error(response.status);
                return;
            }
            
            const data = await response.json();

            setStockData(data);
        }
        catch (err) {
            console.error(err);
        }
    }
    async function createLineChart() {
        setMonthHigh([]);
        setDays([]);
        setMonthHigh(stockData.data.map(data => data.high));
        setDays(stockData.data.map(data => new Date(data.date).getDate()));
        document.getElementById("lineGraph").style.display = "block";
    }

    async function updateData() {
        await populateStockData();
        await createLineChart();
        console.log("Month high");
        console.log(monthHigh);
        console.log("days:");
        console.log(days);
    }
}

export default App;