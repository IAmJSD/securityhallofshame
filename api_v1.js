// Defines all requirements.
const { getAll, append } = require("./cached_queries")
const r = require("./rethinkdb_connection")
const fetch = require("node-fetch")
const uuid4 = require("uuid/v4")

// Defines the approval function.
async function approve(req, res) {
    const approvalId = req.params.approvalId
    const dbEntry = await r.table("pending_approval").get(approvalId).run()
    if (!dbEntry) {
        res.status(403)
        res.send("Request not found.")
        return
    }
    await r.table("pending_approval").get(approvalId).delete().run()
    await append(dbEntry.key, dbEntry.innerKey, dbEntry.value)
    res.send("Done.")
}

// Lists all the routes.
async function list(_, res) {
    res.header("Access-Control-Allow-Origin", "*")
    res.json(await getAll())
}

// Validates reCaptcha.
async function validateRecaptcha(req, _, next) {
    req.recaptcha = await (await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${encodeURIComponent(req.body.recaptchaResponse)}`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        },
    )).json()
    if (req.recaptcha.success && req.recaptcha.action !== "social") req.recaptcha.success = false
    next()
}

// The post route.
async function post(req, res) {
    console.log(`ReCaptcha: ${JSON.stringify(req.recaptcha)}`)
    if (!req.recaptcha.success) {
        res.status(403)
        res.json({
            success: false,
            error: "ReCAPTCHA error. Please try again.",
        })
    } else {
        const key = String(req.body.key)
        const innerKey = String(req.body.innerKey)
        const value = String(req.body.value)
        if (value === "" || innerKey === "" || key === "") {
            res.status(400)
            res.json({
                success: false,
                error: "A part of your request is blank.",
            })
        } else {
            if (0.5 > req.recaptcha.score) {
                res.status(400)
                res.json({
                    success: false,
                    error: "You have a bad reCaptcha score. Please rerun.",
                })
            } else {
                const id = uuid4()
                await r.table("pending_approval").insert({
                    id, value, key, innerKey,
                }).run()

                const msg = {
                    content: `<@${process.env.DISCORD_USER_ID}>`,
                    embeds: [
                        {
                            title: "Hall of Shame Request",
                            fields: [
                                {
                                    name: "Key",
                                    value: key,
                                },
                                {
                                    name: "Inner Key",
                                    value: innerKey,
                                },
                                {
                                    name: "Value",
                                    value,
                                },
                                {
                                    name: "Approve",
                                    value: `https://${process.env.DOMAIN}/v1/approve/${id}`,
                                },
                            ],
                        },
                    ],
                }

                const fetchRes = await fetch(process.env.DISCORD_WEBHOOK, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(msg),
                })

                if (!fetchRes.ok) throw await fetchRes.text()

                res.json({
                    success: true,
                })
            }
        }
    }
}

// Initialises the routes.
module.exports = app => {
    app.get("/v1/recaptcha_site_key", (_, res) => res.json(process.env.RECAPTCHA_SITE_KEY))
    app.get("/v1/approve/:approvalId", approve)
    app.get("/v1/list", list)
    app.post("/v1/post", validateRecaptcha, post)
}
