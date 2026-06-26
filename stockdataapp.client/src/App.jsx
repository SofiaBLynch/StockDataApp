import { useEffect, useState } from 'react';
import './App.css';
import { LineChart } from '@mui/x-charts/LineChart';
import  dayjs  from 'dayjs';

function App() {
    const [stockData, setStockData] = useState();
    const [symbol, setSymbol] = useState("TSLA");
    const [yAxisLabel, setYAxisLabel] = useState("Price of Day");
    const high =
        stockData?.data.map(d => d.high) ?? [];
    const low = 
        stockData?.data.map(d => d.low) ?? [];
    const open = 
        stockData?.data.map(d => d.open) ?? [];
    const close =
        stockData?.data.map(d => d.close) ?? [];
    const volume =
        stockData?.data.map(d => d.volume) ?? [];

    const xAxisData =
        stockData?.data.map(d => new Date(d.date)) ?? [];

    useEffect(() => {
        populateStockData();
        //createLineChart();
    }, []);

    function collapseTable() {
        document.getElementById("datatable").style.display = document.getElementById("datatable").style.display == "none" ? "block": "none";
    }

    const dataContents = stockData === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started.</em></p>
        : 
                
        <div key={stockData.symbol}>
            <div>
                <h3>{stockData.symbol}</h3>
                <button onClick={collapseTable}>Collapse</button>
            </div>
                    <table className="table table-striped" aria-labelledby="tableLabel" id="datatable" display="none">
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
            <h1 id="tableLabel">Stock Data Tracker</h1>
            <text
                id="errorMessage"
                display="none">
                Error: Invalid stock code
            </text>
            <text
                id="serverErrorMessage"
                display="none">
                Error: There was an issue fetching data. Please try again in a few minutes.
            </text>
            <input name="stockCodeInput"
                placeholder="Input 1-5 length stock"
                minLength={1}
                maxLength={5}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            <button id="submit" onClick={populateStockData}>
                Search
            </button>
            
            {dataContents}
            {stockData &&
                <LineChart
                series={[
                    { label: "Open Price of Day", data: open }, 
                    { label: "High Price of Day", data: high },
                    { label: "Low Price of Day", data: low },
                    { label: "Close Price of Day", data: close },
                ]}
                    xAxis={[
                        {
                            label: "Date",
                            data: xAxisData,
                            scaleType: "time",
                            valueFormatter: (date) => dayjs(date).format("MMMD"),
                        }]}
                    yAxis={[{ label: yAxisLabel }]}
                    width={900}
                    height={400}

                />
            }
            {stockData &&
                <LineChart
                    series={[
                        { label: "Volume", data: volume },
                    ]}
                    xAxis={[
                        {
                            label: "Date",
                            data: xAxisData,
                            scaleType: "time",
                            valueFormatter: (date) => dayjs(date).format("MMMD"),
                        }]}
                    yAxis={[{ label: "Volume of Purchase" }]}
                    width={900}
                    height={400}

                />
            }
        </div>
    );
    
    async function populateStockData() {
        console.log("here " + symbol);
        try {
            const response = await fetch(
                `stockdata?symbol=${encodeURIComponent(symbol)}`
            );

            if (response.status == 500) {
                document.getElementById("serverErrorMessage").style.display = "block";
                return;
            } else {
                document.getElementById("serverErrorMessage").style.display = "none"; 
            }
            if (response.status == 400) {
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

}

export default App;