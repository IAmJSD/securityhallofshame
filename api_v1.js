const thisWrapper = (outerThis, key, ...args) => (req, res, next) => {
    if (next) args.push(next)
    outerThis[key](req, res, ...args)
}

module.exports = class APIV1 {
    constructor(app, recaptchaHandler) {
        this.app = app
        this.recaptchaHandler = recaptchaHandler
        this.app.post("/v1/post", thisWrapper(this, "validateRecaptcha"), thisWrapper(this, "post"))
    }

    validateRecaptcha(req, res, next) {
        console.log(1)
        next()
    }

    post(req, res) {
        if (req.recaptcha.error) {
            res.status(403)
            res.json({
                error: "Invalid ReCAPTCHA code.",
            })
        } else {
            // lol
        }
    }
}
