// Exports the data.
let data = {}
export let recaptcha = ""
export default data

// Gets the data.
export const getData = async() => {
    const v = await (await fetch("/v1/list")).json()
    for (const k in Object.keys(v).sort()) data[k] = v[k]
    recaptcha += await (await fetch("/v1/recaptcha_site_key")).json()
}
