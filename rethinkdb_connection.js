module.exports = require("rethinkdbdash")({
    pool: true,
    host: process.env.RETHINKDB_HOSTNAME || "127.0.0.1",
    port: 28015,
    db: "securityhallofshame",
    password: process.env.RETHINKDB_PASSWORD,
    user: process.env.RETHINKDB_USER,
})
