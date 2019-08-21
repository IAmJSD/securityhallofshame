module.exports = require("redis").createClient({
    db: 0,
    host: process.env.REDIS_HOSTNAME || "127.0.0.1",
    password: process.env.REDIS_PASSWORD,
})
