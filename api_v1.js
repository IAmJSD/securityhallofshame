// Defines all requirements.
const { getAll, append } = require("./cached_queries")
const r = require("./rethinkdb_connection")
const fetch = require("node-fetch")

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
        res.json(await getAll())
    }

    validateRecaptcha(req, _, next) {
        req.recaptcha = await (await fetch(
            "https://www.google.com/recaptcha/api/siteverify", {
                body: {
                    
                },
            },
        )).json()
        next()
    }

    post(req, res) {
        if (!req.recaptcha.success) {
            res.status(403)
            res.json({
                error: "ReCAPTCHA error. Please try again.",
            })
        } else {
            // lol
        }
    }
}
