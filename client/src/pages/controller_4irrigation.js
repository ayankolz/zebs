import React, { useEffect, useState } from 'react';
import '../styles/IrrigationPage.css';

const Irrigation4 = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIrrigationData = async () => {
            try {
                const response = await fetch(`http://localhost:3005/auth/irrigation4`);
                if (!response.ok) throw new Error(`Error ${response.status}`);
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error('Error fetching irrigation data:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchIrrigationData();
    }, []);

    return (
        <div className="irrigation-page-container">
            <h2 className="irrigation-title">Irrigation Data - Microcontroller 4</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="irrigation-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                                    <td>{item.action}</td>
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

export default Irrigation4;
