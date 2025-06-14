process.env.DEBUG = 'mqttjs*'; // Enable debug logging

import mqtt from 'mqtt';
import { con } from './db.js';

const client = mqtt.connect('mqtts://5f51a9923e6c43bd9893263ef6f2d7f7.s1.eu.hivemq.cloud:8883', {
    username: 'ohteesss',
    password: 'Project2025',
    clientId: 'ESP32_Master',
    rejectUnauthorized: false // TEMP for testing
});

client.on('connect', () => {
    console.log('✅ Connected to MQTT broker');
    client.subscribe('farm/control/moisture_low');
    client.subscribe('farm/control/moisture_high');
    client.subscribe('microcontroller1/system');
    client.subscribe('microcontroller1/sensors');
    client.subscribe('microcontroller1/irrigation');
    client.subscribe('microcontroller1/motion');
    client.subscribe('microcontroller2/system');
    client.subscribe('microcontroller2/sensors');
    client.subscribe('microcontroller2/irrigation');
    client.subscribe('microcontroller2/motion');
    client.subscribe('microcontroller3/system');
    client.subscribe('microcontroller3/sensors');
    client.subscribe('microcontroller3/irrigation');
    client.subscribe('microcontroller3/motion');
    client.subscribe('microcontroller4/system');
    client.subscribe('microcontroller4/sensors');
    client.subscribe('microcontroller4/irrigation');
    client.subscribe('microcontroller4/motion');
});

client.on('error', (err) => {
    console.error('❌ MQTT Connection Error:', err.message);
});

client.on('message', (topic, message) => {
    const msgStr = message.toString();
    const timestamp = new Date();

    console.log('📥 Raw MQTT Message:', msgStr);  // Log the raw message
    console.log('🔍 Topic:', topic);              // Log the topic received

    let jsonData;
    try {
        jsonData = JSON.parse(msgStr);
        console.log('✅ Parsed JSON:', jsonData);  // Log the parsed JSON object
    } catch (err) {
        console.error('❌ Failed to parse JSON message:', msgStr);
        return;
    }

    switch (topic) {
        case 'microcontroller1/sensors':
            con.query(
                "INSERT INTO sensors (microcontroller, timestamp, temperature, humidity, moistureOne, moistureTwo) VALUES (1, ?, ?, ?, ?, ?)",
                [timestamp, jsonData.temperature, jsonData.humidity, jsonData.moistureOne, jsonData.moistureTwo],
                (err) => {
                    if (err) {
                        console.error('❌ DB Insert Error (sensors):', err.message);
                    } else {
                        console.log('✅ sensors saved to DB');
                    }
                }
            );
            break;
        case 'microcontroller2/sensors':
            con.query(
                "INSERT INTO sensors (microcontroller, timestamp, temperature, humidity, moistureOne, moistureTwo) VALUES (2, ?, ?, ?, ?, ?)",
                [timestamp, jsonData.temperature, jsonData.humidity, jsonData.moistureOne, jsonData.moistureTwo],
                (err) => {
                    if (err) {
                        console.error('❌ DB Insert Error (sensors):', err.message);
                    } else {
                        console.log('✅ sensors saved to DB');
                    }
                }
            );
            break;
        case 'microcontroller3/sensors':
            con.query(
                "INSERT INTO sensors (microcontroller, timestamp, temperature, humidity, moistureOne, moistureTwo) VALUES (3, ?, ?, ?, ?, ?)",
                [timestamp, jsonData.temperature, jsonData.humidity, jsonData.moistureOne, jsonData.moistureTwo],
                (err) => {
                    if (err) {
                        console.error('❌ DB Insert Error (sensors):', err.message);
                    } else {
                        console.log('✅ sensors saved to DB');
                    }
                }
            );
            break;
        case 'microcontroller4/sensors':
            con.query(
                "INSERT INTO sensors (microcontroller, timestamp, temperature, humidity, moistureOne, moistureTwo) VALUES (4, ?, ?, ?, ?, ?)",
                [timestamp, jsonData.temperature, jsonData.humidity, jsonData.moistureOne, jsonData.moistureTwo],
                (err) => {
                    if (err) {
                        console.error('❌ DB Insert Error (sensors):', err.message);
                    } else {
                        console.log('✅ sensors saved to DB');
                    }
                }
            );
            break;
        case 'microcontroller4/irrigation': {
            const { action, timestamp: actionTime } = jsonData;

            if (!action || typeof actionTime === 'undefined') {
                console.error('❌ Invalid irrigation message:', jsonData);
                return;
            }

            con.query(
                "INSERT INTO irrigation (microcontroller, timestamp, action, action_timestamp) VALUES (4, ?, ?, ?)",
                [timestamp, action, actionTime],
                (err) => {
                    if (err) {
                        console.error('❌ DB Insert Error (irrigation):', err.message);
                    } else {
                        console.log('✅ irrigation event saved to DB');
                    }
                }
            );
            break;
        }
        case 'microcontroller3/irrigation': {
            const { action, timestamp: actionTime } = jsonData;

            if (!action || typeof actionTime === 'undefined') {
                console.error('❌ Invalid irrigation message:', jsonData);
                return;
            }

            con.query(
                "INSERT INTO irrigation (microcontroller, timestamp, action, action_timestamp) VALUES (3, ?, ?, ?)",
                [timestamp, action, actionTime],
                (err) => {
                    if (err) {
                        console.error('❌ DB Insert Error (irrigation):', err.message);
                    } else {
                        console.log('✅ irrigation event saved to DB');
                    }
                }
            );
            break;
        }
        case 'microcontroller2/irrigation': {
            const { action, timestamp: actionTime } = jsonData;

            if (!action || typeof actionTime === 'undefined') {
                console.error('❌ Invalid irrigation message:', jsonData);
                return;
            }

            con.query(
                "INSERT INTO irrigation (microcontroller, timestamp, action, action_timestamp) VALUES (2, ?, ?, ?)",
                [timestamp, action, actionTime],
                (err) => {
                    if (err) {
                        console.error('❌ DB Insert Error (irrigation):', err.message);
                    } else {
                        console.log('✅ irrigation event saved to DB');
                    }
                }
            );
            break;
        }
        case 'microcontroller1/irrigation': {
            const { action, timestamp: actionTime } = jsonData;

            if (!action || typeof actionTime === 'undefined') {
                console.error('❌ Invalid irrigation message:', jsonData);
                return;
            }

            con.query(
                "INSERT INTO irrigation (microcontroller, timestamp, action, action_timestamp) VALUES (1, ?, ?, ?)",
                [timestamp, action, actionTime],
                (err) => {
                    if (err) {
                        console.error('❌ DB Insert Error (irrigation):', err.message);
                    } else {
                        console.log('✅ irrigation event saved to DB');
                    }
                }
            );
            break;
        }




        // Repeat similar parsing/logic as needed for other topics...

        default:
            console.warn(`⚠️ Unhandled topic: ${topic}`);
    }
});


