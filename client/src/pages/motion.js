import React, { useEffect, useState } from 'react';
import '../styles/MotionPage.css';
const Motion = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMotionData = async () => {
            try {
                const response = await fetch(`http://localhost:3005/auth/motion4`);
                if (!response.ok) throw new Error(`Error ${response.status}`);
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error('Error fetching motion data:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMotionData();
    }, []);
    useEffect(() => {
    const fetchMotionData = async () => {
        try {
            const response = await fetch(`http://localhost:3005/auth/motion3`);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error('Error fetching motion data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    fetchMotionData();
    }, []);
    useEffect(() => {
    const fetchMotionData = async () => {
        try {
            const response = await fetch(`http://localhost:3005/auth/motion2`);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error('Error fetching motion data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    fetchMotionData();
    }, []);
    useEffect(() => {
    const fetchMotionData = async () => {
        try {
            const response = await fetch(`http://localhost:3005/auth/motion1`);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error('Error fetching motion data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    fetchMotionData();
    }, []);

    return (
        <div className="motion-page-container">
            <h2 className="motion-title">Motion Detection Unit</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="motion-table">
                    <thead>
                        <tr>
                            <th>Microcontroller</th>
                            <th>Timestamp</th>
                            <th>ACTION OCCURRED</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.microcontroller}</td>
                                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                                    <td>{item.data}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No motion data available from any microcontroller.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Motion;
