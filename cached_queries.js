// Defines the Redis/RethinkDB connections.
const redis = require("./redis_connection")
const r = require("./rethinkdb_connection")

// Gets all the keys async.
const keysAsync = () => new Promise((res, rej) => redis.keys("*", (err, reply) => err ? rej(err) : res(reply)))

// Gets a item async.
const getAsync = key => new Promise((res, rej) => redis.get(key, (err, reply) => err ? rej(err) : res(reply)))

// Initialises the cache.
const init = async () => {
    const keys = await keysAsync()
    if (keys.length === 0) {
        // We'll try loading from the DB into the cache.
        const records = await r.table("oopsies").coerceTo("array").run()
        for (const record of records) {
            redis.set(record.id, JSON.stringify(record.data))
        }
    }
    return keys
}

// Gets all items from the cache.
const getAll = async () => {
    let keys = await keysAsync()
    if (keys.length === 0) keys = await init()
    const all = {}
    for (const k of keys) all[k] = JSON.parse(await getAsync(k))
    return all
}

// Appends to a category.
const append = async (key, innerKey, value) => {
    let i = await getAsync(key)
    if (i) i = JSON.parse(i)
    else i = {}
    i[innerKey] = value
    redis.set(key, JSON.stringify(i))
    await r.table("oopsies").insert({ id: key, data: i }, { conflict: "replace" }).run()
}

// Exports all the things.
module.exports = { init, getAll, append }
