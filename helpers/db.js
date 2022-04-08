const mongoose = require('mongoose');
const MONGO_USERNAME = 'admin';
const MONGO_PASSWORD = 'Lru3Y3P3r8';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'SEO-CoreSet';
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

mongoose.connect(url, {useNewUrlParser: true});