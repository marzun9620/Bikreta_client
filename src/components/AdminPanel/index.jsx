import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Header from '../Header';
import Footer from '../Footer';


const SalesGraph = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("http://localhost:3000/bar/sales-data"); // Replace with your endpoint
                const data = response.data;

                setChartData({
                    labels: data.map(d => d._id.location),
                    datasets: [{
                        label: 'Sales by Location',
                        data: data.map(d => d.totalSales),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)'
                    }]
                });
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <Header />
            <div style={{ padding: '20px' }}>
                <h2>Sales by Location</h2>
                {chartData.labels && <Bar data={chartData} />}
            </div>
            <Footer />
        </div>
    );
}

export default SalesGraph;
