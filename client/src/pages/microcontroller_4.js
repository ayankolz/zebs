import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MicrocontrollerPage.css';

const Microcontroller4 = () => {
    const navigate = useNavigate();

    const handleNavigation = (section) => {
        navigate(`/microcontroller/4/${section}`);
    };

    return (
        <div className="mc-page-container">
            <h1 className="mc-title">Microcontroller 4</h1>
            <div className="mc-button-group">
                <button className="mc-section-btn" onClick={() => handleNavigation('system')}>System</button>
                <button className="mc-section-btn" onClick={() => handleNavigation('sensors')}>Sensors</button>
                <button className="mc-section-btn" onClick={() => handleNavigation('irrigation')}>Irrigation</button>
            </div>
        </div>
    );
};

export default Microcontroller4;
