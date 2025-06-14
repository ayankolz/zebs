import React from "react";
import '../styles/advance-page.css';
import { useNavigate } from 'react-router-dom';

function Advance() {
    const navigate = useNavigate();

    const handleClick = (controllerNumber) => {
        if (controllerNumber === 5) {
            navigate(`/motion_detection`);
        } else {
            navigate(`/microcontroller/${controllerNumber}`);
        }
    };

    return (
        <div className="advance-container">
            <h2 className="advance-title">Select a Microcontroller</h2>
            <div className="button-grid">
                {[1, 2, 3, 4].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleClick(num)}
                        className="controller-button"
                    >
                        Microcontroller {num}
                    </button>
                ))}
                <button
                    key={5}
                    onClick={() => handleClick(5)}
                    className="controller-button"
                >
                    Motion Detection
                </button>
            </div>
        </div>
    );
}

export default Advance;
