<template>
    <div :class="`modal ${toggled ? 'is-active' : ''}`">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    Security Fail Suggestion
                </p>
                <button class="delete" aria-label="close" @click="toggle"></button>
            </header>
            <section class="modal-card-body">
                <p><b>Company/Project Name:</b></p>
                <select v-model="selected" :selected="keys[0]">
                    <option v-for="key in keys" v-bind:key="key">{{ key }}</option>
                </select>
                <input v-if="selected === 'Other'" v-model="textbox" placeholder="Company/Project Name">
                <hr style="margin: 5px">
                <p><b>Title:</b></p>
                <input class="input" v-model="title" placeholder="Title">
                <hr style="margin: 5px">
                <p><b>URL:</b></p>
                <input class="input" v-model="url" placeholder="URL">
                <hr style="margin: 5px">
                <a class="button" @click="runSubmit">Submit</a>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import data from "../data"
    import { recaptcha } from "../data"
    import { load } from "recaptcha-v3"

    let loadedRecaptcha: any
    load(recaptcha).then(i => loadedRecaptcha = i)

    const keys = Object.keys(data)
    keys.push("Other")

    export default Vue.extend({
        name: "SuggestionBox",
        data() {
            return {
                toggled: false,
                keys,
                selected: keys[0],
                textbox: "",
                title: "",
                url: "",
                error: "",
            }
        },
        methods: {
            getCompanyName() {
                if (this.$data.selected === "Other") return this.$data.textbox
                return this.$data.selected
            },
            async runSubmit() {
                const companyName = this.getCompanyName()
                const title = this.$data.title
                const url = this.$data.url
                let recaptchaResponse
                try {
                    recaptchaResponse = await loadedRecaptcha.execute("social")
                } catch (_) {
                    alert("Failed to get a reCaptcha token.")
                    return
                }
                const fetchRes = await fetch(
                    "/v1/post", {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify({
                            recaptchaResponse,
                            value: url,
                            innerKey: title,
                            key: companyName,
                        }),
                    },
                )
                if (!fetchRes.ok) {
                    const j = await fetchRes.json()
                    alert(j.error)
                    return
                }
                this.toggle()
                alert("Thanks for your feedback!")
            },
            toggle() {
                this.$data.toggled = !this.$data.toggled
            },
        },
    })
</script>
