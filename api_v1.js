// Defines all requirements.
const { getAll, append } = require("./cached_queries")
const r = require("./rethinkdb_connection")
const fetch = require("node-fetch")
const sendEmail = require("./send_email")
const uuid4 = require("uuid/v4")

// Wraps the this context.
const thisWrapper = (outerThis, key, ...args) => (req, res, next) => {
    if (next) args.push(next)
    outerThis[key](req, res, ...args)
}

// Defines API V1.
module.exports = class APIV1 {
    constructor(app, recaptchaHandler) {
        this.app = app
        this.recaptchaHandler = recaptchaHandler
        this.app.post("/v1/post", thisWrapper(this, "validateRecaptcha"), thisWrapper(this, "post"))
        this.app.get("/v1/list", thisWrapper(this, "list"))
        this.app.get("/v1/approve/:approvalId", thisWrapper(this, "approve"))
        this.app.get("/v1/recaptcha_site_key", (_, res) => res.json(process.env.RECAPTCHA_SITE_KEY))
    }

    async approve(req, res) {
        const approvalId = req.params.approvalId
        const dbEntry = await r.table("pending_approval").get(approvalId).run()
        if (!dbEntry) {
            res.status(403)
            res.text("Request not found.")
            return
        }
        await r.table("pending_approval").get(approvalId).delete().run()
        await append(dbEntry.key, dbEntry.innerKey, dbEntry.value)
        res.text("Done.")
    }

    async list(_, res) {
        res.header("Access-Control-Allow-Origin", "*")
        res.json(await getAll())
    }

    async validateRecaptcha(req, _, next) {
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

    async post(req, res) {
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
                    const query = {
                        id, value, key, innerKey,
                    }
                    await r.table("pending_approval").insert(query).run()
                    await sendEmail("Hall Of Shame Request", `
                    Key: ${key}
                    Inner Key: ${innerKey}
                    Value: ${value}
                    Approve: https://${process.env.DOMAIN}/v1/approve/${id}
                    `)
                    res.json({
                        success: true,
                    })
                }
            }
        }
    }
}
