import React, { useEffect, useState } from 'react';
import '../styles/SensorsPage.css';

const Sensors1 = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const response = await fetch(`http://localhost:3005/auth/sensors1`);
                if (!response.ok) throw new Error(`Error ${response.status}`);
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error('Error fetching sensors data:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSensorData();
    }, []);

    return (
        <div className="sensors-page-container">
            <h2 className="sensors-title">Sensors Data - Microcontroller 1</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="sensors-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Timestamp</th>
                            <th>Temperature</th>
                            <th>Humidity</th>
                            <th>moistureOne</th>
                            <th>moistureTwo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                                    <td>{item.temperature}</td>
                                    <td>{item.humidity}</td>
                                    <td>{item.moistureOne}</td>
                                    <td>{item.moistureTwo}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No data available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Sensors1;
