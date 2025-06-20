import mqtt from 'mqtt';
import { db } from './db.js';
import { config } from './config.js';

const client = mqtt.connect(config.mqttUri, {
    username: config.mqttUsername,
    password: config.mqttPassword,
    clientId: config.mqttClientId,
    rejectUnauthorized: false
});



client.on('connect', () => {
    console.log('✅ Connected to MQTT broker');

    const topics = [
        'farm/control/moisture_low',
        'farm/control/moisture_high',
        'microcontroller1/system',
        'microcontroller1/sensors',
        'microcontroller1/irrigation',
        'microcontroller1/motion',
        'microcontroller2/system',
        'microcontroller2/sensors',
        'microcontroller2/irrigation',
        'microcontroller2/motion',
        'microcontroller3/system',
        'microcontroller3/sensors',
        'microcontroller3/irrigation',
        'microcontroller3/motion',
        'microcontroller4/system',
        'microcontroller4/sensors',
        'microcontroller4/irrigation',
        'microcontroller4/motion'
    ];

    client.subscribe(topics, (err) => {
        if (err) {
            console.error('❌ Subscription error:', err.message);
        } else {
            console.log('✅ Subscribed to topics');
        }
    });
});

client.on('error', (err) => {
    console.error('❌ MQTT Connection Error:', err.message);
});

client.on('message', async (topic, message) => {
    const rawMsg = message.toString().trim();
    const timestamp = new Date();

    console.log('📥 Raw MQTT Message:', rawMsg);
    console.log('🔍 Topic:', topic);

    const microIdMatch = topic.match(/microcontroller(\d)/);
    const microcontroller = microIdMatch ? parseInt(microIdMatch[1]) : null;

    if (!microcontroller) {
        console.warn('⚠️ Invalid microcontroller topic:', topic);
        return;
    }

    try {
        // Strip trailing commas to fix malformed JSON
        const cleanMsg = rawMsg.replace(/,\s*}/g, '}');

        if (topic.includes('/sensors')) {
            const sensorsCollection = db.collection('sensors');
            const jsonData = JSON.parse(cleanMsg);

            await sensorsCollection.insertOne({
                microcontroller,
                timestamp,
                temperature: jsonData.temperature,
                humidity: jsonData.humidity,
                moistureOne: jsonData.moistureOne,
                moistureTwo: jsonData.moistureTwo
            });

            console.log(`✅ Sensors data saved (MC${microcontroller})`);
        }

        else if (topic.includes('/irrigation')) {
            const irrigationCollection = db.collection('irrigation');
            const jsonData = JSON.parse(cleanMsg);

            await irrigationCollection.insertOne({
                microcontroller,
                timestamp,
                action: jsonData.action,
                action_timestamp: jsonData.timestamp
            });

            console.log(`✅ Irrigation data saved (MC${microcontroller})`);
        }

        else if (topic.includes('/system')) {
            const systemCollection = db.collection('system');

            await systemCollection.insertOne({
                microcontroller,
                data: rawMsg,
                timestamp
            });

            console.log(`✅ System data saved (MC${microcontroller})`);
        }

        else if (topic.includes('/motion')) {
            const motionCollection = db.collection('motion');
            let motionValue;

            try {
                motionValue = JSON.parse(cleanMsg);
            } catch {
                console.error('❌ Invalid motion value:', rawMsg);
                return;
            }

            const motionText = motionValue ? "motion detected" : "no motion";

            await motionCollection.insertOne({
                microcontroller,
                data: motionText,
                timestamp
            });

            console.log(`✅ Motion data saved (MC${microcontroller})`);
        }

        else {
            console.warn('⚠️ Unhandled topic:', topic);
        }
    } catch (err) {
        console.error('❌ MongoDB Insert Error:', err.message);
    }
});
