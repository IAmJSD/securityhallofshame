// Requires Express stuff.
const express = require("express")

// Initialises the cache.
require("./cached_queries").init().then(() => {
    // Defines the app.
    const app = express()

    // Adds the required Express middleware.
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static("frontend-dist"))

    // The API handler.
    new (require("./api_v1"))(app)

    // Starts listening on port 7000.
    app.listen(7000, () => console.log("Listening on port 7000."))
})
