import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';  // Ensure this includes the grid layout from earlier

const socket = io('http://localhost:5000');

function App() {
    const [ceBullish, setCeBullish] = useState([]);
    const [ceBearish, setCeBearish] = useState([]);
    const [peBullish, setPeBullish] = useState([]);
    const [peBearish, setPeBearish] = useState([]);

    useEffect(() => {
        socket.on('update', (data) => {
            console.log(data); // Debug the incoming data

            // Default message if no 'Message' is found
            const message = data.message || 'No message received';

            switch (data.section) {
                case 'CE Bullish':
                    setCeBullish(prev => [...prev, { message, type: 'bullish' }]);
                    break;
                case 'CE Bearish':
                    setCeBearish(prev => [...prev, { message, type: 'bearish' }]);
                    break;
                case 'PE Bullish':
                    setPeBullish(prev => [...prev, { message, type: 'bullish' }]);
                    break;
                case 'PE Bearish':
                    setPeBearish(prev => [...prev, { message, type: 'bearish' }]);
                    break;
                default:
                    console.log('Unknown section:', data.section);
                    break;
            }
        });

        return () => {
            socket.off('update');
        };
    }, []);

    const resetSection = (setSection) => {
        setSection([]); // Reset the section data
    };

    // Render checkbox with tick for bullish, cross for bearish
    const renderCheckbox = (type) => {
        return type === 'bullish' ? '✔️' : '❌'; // Checkmark for bullish, cross for bearish
    };

    // Set color based on message type
    const getHeadingColor = (type) => {
        return type === 'bullish' ? 'green' : 'red';
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Trading Alerts Dashboard</h1>
            <div className="dashboard-grid">
                <div className="dashboard-section">
                    <h2 style={{ color: getHeadingColor('bullish') }}>CE Bullish Checks</h2>
                    {ceBullish.map((msg, index) => (
                        <p key={index}>
                            <span className="checkbox">{renderCheckbox(msg.type)}</span> {msg.message}
                        </p>
                    ))}
                    <button onClick={() => resetSection(setCeBullish)}>Reset</button>
                </div>
                <div className="dashboard-section">
                    <h2 style={{ color: getHeadingColor('bullish') }}>PE Bullish Checks</h2>
                    {peBullish.map((msg, index) => (
                        <p key={index}>
                            <span className="checkbox">{renderCheckbox(msg.type)}</span> {msg.message}
                        </p>
                    ))}
                    <button onClick={() => resetSection(setPeBullish)}>Reset</button>
                </div>
                <div className="dashboard-section">
                    <h2 style={{ color: getHeadingColor('bearish') }}>CE Bearish Checks</h2>
                    {ceBearish.map((msg, index) => (
                        <p key={index}>
                            <span className="checkbox">{renderCheckbox(msg.type)}</span> {msg.message}
                        </p>
                    ))}
                    <button onClick={() => resetSection(setCeBearish)}>Reset</button>
                </div>
                <div className="dashboard-section">
                    <h2 style={{ color: getHeadingColor('bearish') }}>PE Bearish Checks</h2>
                    {peBearish.map((msg, index) => (
                        <p key={index}>
                            <span className="checkbox">{renderCheckbox(msg.type)}</span> {msg.message}
                        </p>
                    ))}
                    <button onClick={() => resetSection(setPeBearish)}>Reset</button>
                </div>
            </div>
        </div>
    );
}

export default App;
