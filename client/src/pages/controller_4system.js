import React, { useEffect, useState } from 'react';
import '../styles/SystemPage.css'; // Create this CSS file for styling

const System4 = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSystemData = async () => {
            try {
                const response = await fetch(`http://localhost:3005/auth/system4`);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}`);
                }
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error('Error fetching system data:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSystemData();
    }, []);

    return (
        <div className="system-page-container">
            <h2 className="system-title">System Data - Microcontroller 4</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="system-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                                    <td>{item.data}</td>
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

export default System4;
