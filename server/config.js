import dotenv from 'dotenv';
dotenv.config();

export const config = {
    email: process.env.MY_EMAIL,
    emailPassword: process.env.MY_PASSWORD,
    mongoUri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME || 'zebs',
    mqttUri: process.env.MQTT_URI,
    mqttUsername: process.env.MQTT_USERNAME,
    mqttPassword: process.env.MQTT_PASSWORD,
    mqttClientId: process.env.MQTT_CLIENT_ID
};
