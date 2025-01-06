import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io('http://localhost:5000');

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;
const resetThreshold = 7;
let lastNotificationTimestamp = 0;
const notificationInterval = 5000;

const specificMessagesToIgnore = ["FVG Created"]; // List of specific messages to ignore

function App() {
    const [ceBullish, setCeBullish] = useState([]);
    const [ceBearish, setCeBearish] = useState([]);
    const [peBullish, setPeBullish] = useState([]);
    const [peBearish, setPeBearish] = useState([]);

    useEffect(() => {
        socket.on('update', (data) => {
            const message = data.message || 'No message received';
            const currentTime = formatTime(new Date());

            if (shouldIgnoreMessage(message)) return;

            switch (data.section) {
                case 'CE Bullish':
                    setCeBullish(prev => handleAlerts(prev, message, currentTime, 'CE Bullish', 'bullish', setCeBullish));
                    break;
                case 'CE Bearish':
                    setCeBearish(prev => handleAlerts(prev, message, currentTime, 'CE Bearish', 'bearish', setCeBearish));
                    break;
                case 'PE Bullish':
                    setPeBullish(prev => handleAlerts(prev, message, currentTime, 'PE Bullish', 'bullish', setPeBullish));
                    break;
                case 'PE Bearish':
                    setPeBearish(prev => handleAlerts(prev, message, currentTime, 'PE Bearish', 'bearish', setPeBearish));
                    break;
                default:
                    break;
            }
        });

        return () => {
            socket.off('update');
        };
    }, []);

    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${hours}:${minutes}:${seconds} ${ampm}`;
    };

    const shouldIgnoreMessage = (message) => {
        return specificMessagesToIgnore.includes(message);
    };

    const handleAlerts = (prevAlerts, message, currentTime, section, type, setSection) => {
        const newAlert = { message, type, time: currentTime };
        const newAlerts = [...prevAlerts, newAlert];

        if (newAlerts.length === 5) {
            sendTelegramNotification(section, type, newAlerts);
        }

        if (newAlerts.length > resetThreshold) {
            return newAlerts.slice(-resetThreshold);
        } else {
            return newAlerts;
        }
    };

    const sendTelegramNotification = (section, type, alerts) => {
        const currentTime = Date.now();
        if (currentTime - lastNotificationTimestamp < notificationInterval) {
            return;
        }

        lastNotificationTimestamp = currentTime;

        const alertMessages = alerts.map((alert, index) => `${index + 1}. ${alert.message} [${alert.time}]`).join('\n');
        const message = `🚨 ${section.toUpperCase()} ${type.toUpperCase()} ALERT 🚨\n\n${alertMessages}`;

        axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        }).catch(error => {
            console.error('Error sending Telegram message:', error);
        });
    };

    const resetSection = (setSection) => {
        setSection([]);
    };

    const renderCheckbox = (type) => {
        return type === 'bullish' ? '✔️' : '❌';
    };

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
                            {index + 1}. <span className="checkbox">{renderCheckbox(msg.type)}</span> {msg.message}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [{msg.time}]
                        </p>
                    ))}
                    <button onClick={() => resetSection(setCeBullish)}>Reset</button>
                </div>
                <div className="dashboard-section">
                    <h2 style={{ color: getHeadingColor('bullish') }}>PE Bullish Checks</h2>
                    {peBullish.map((msg, index) => (
                        <p key={index}>
                            {index + 1}. <span className="checkbox">{renderCheckbox(msg.type)}</span> {msg.message}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [{msg.time}]
                        </p>
                    ))}
                    <button onClick={() => resetSection(setPeBullish)}>Reset</button>
                </div>
                <div className="dashboard-section">
                    <h2 style={{ color: getHeadingColor('bearish') }}>CE Bearish Checks</h2>
                    {ceBearish.map((msg, index) => (
                        <p key={index}>
                            {index + 1}. <span className="checkbox">{renderCheckbox(msg.type)}</span> {msg.message}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [{msg.time}]
                        </p>
                    ))}
                    <button onClick={() => resetSection(setCeBearish)}>Reset</button>
                </div>
                <div className="dashboard-section">
                    <h2 style={{ color: getHeadingColor('bearish') }}>PE Bearish Checks</h2>
                    {peBearish.map((msg, index) => (
                        <p key={index}>
                            {index + 1}. <span className="checkbox">{renderCheckbox(msg.type)}</span> {msg.message}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [{msg.time}]
                        </p>
                    ))}
                    <button onClick={() => resetSection(setPeBearish)}>Reset</button>
                </div>
            </div>
        </div>
    );
}

export default App;
