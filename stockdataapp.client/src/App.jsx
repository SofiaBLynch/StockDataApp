import { useEffect, useState } from 'react';
import './App.css';
import { LineChart } from '@mui/x-charts/LineChart';
import  dayjs  from 'dayjs';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

function App() {
    const [stockData, setStockData] = useState();
    const [symbol, setSymbol] = useState("TSLA");
    const [showTable, setShowTable] = useState(true);
    const xAxisData = stockData?.data.map(d => new Date(d.date)) ?? [];
    const high   = stockData?.data.map(d => d.high) ?? [];
    const low    = stockData?.data.map(d => d.low) ?? [];
    const open   = stockData?.data.map(d => d.open) ?? [];
    const close  = stockData?.data.map(d => d.close) ?? [];
    const volume = stockData?.data.map(d => d.volume) ?? [];
    const volumeFormatter = new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    });

    useEffect(() => {
        populateStockData();
    }, []);

    function collapseTable() {
        setShowTable(prev => !prev);
    }

    function checkError() {
        document.getElementById("serverErrorMessage").style.display = "none";
        document.getElementById("errorMessage").style.display = "none";
        if (symbol.length < 1 || symbol.length > 5) {
            document.getElementById("errorMessage").style.display = "block";
            return true;
        }
        return false;
    }

    async function populateStockData() {
        let response;
        try {
            let error = checkError();
            if (error) { return; }

            response = await fetch(
                `stockdata?symbol=${encodeURIComponent(symbol)}`
            );

            if (!response.ok) {
                throw new Error(response);
            }

            const data = await response.json();

            setStockData(data);
        }
        catch (err) {
            if (response.status >= 500) {
                document.getElementById("serverErrorMessage").style.display = "block";
                return;
            } else if (response.status >= 400) {
                document.getElementById("errorMessage").style.display = "block";
            } else {
            }
            console.error(err);
        }
    }  
    const dataContents = stockData === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started.</em></p>
        : 
                
        <div key={stockData.symbol}>
            <div className="row-container">
                <h3>{stockData.symbol}</h3>
                {showTable ?
                    <button className="icon-button" onClick={collapseTable }> 
                        <ArrowDropDownCircleIcon className="button-icon" />
                    </button>
                    :
                    <button className="icon-button" onClick={collapseTable}>
                        <ArrowCircleUpIcon className="button-icon" />
                    </button>
                }
            </div>
            {showTable &&
                <>
                    <h4>Detailed Insights for Past Month</h4>
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
                </>
            }
                    
        </div>
        ;            

    return (
        <div>
            <h1 id="tableLabel">Stock Tracker</h1>
            <p
                id="errorMessage"
                className="error-message"
                display="none">
                Error: Invalid stock code
            </p>
            <p
                id="serverErrorMessage"
                className="error-message"
                display="none">
                Error: There was an issue fetching data. Please try again in a few minutes.
            </p>
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
                <>
                    <h3>Stock Data Price for Past Month</h3> 
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
                        yAxis={[{ label: "Price per Stock" }]}
                        width={900}
                        height={400}

                    />
                </>
            }
            {stockData &&
                <>
                    <h3>Volume of Purchase for Past Month</h3>
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
                        yAxis={[
                            {
                                label: "Volume of Purchase in Millions (M)",
                                valueFormatter: (value) => volumeFormatter.format(value),
                            }
                        ]}
                        width={900}
                        height={400}

                />
              </>
            }
        </div>
    );
    
}

export default App;