<template>
    <div style="display: flex; flex-direction: column;">
        <SuggestionBox ref="SuggestionBox"></SuggestionBox>
        <div style="padding-top: 20px">
            <div style="text-align: center">
                <h1 class="title">Security Hall Of Shame</h1>
                <p>Created by <a href="https://jakegealer.me">Jake Gealer</a>. The source code <a href="https://github.com/jakemakesstuff/securityhallofshame">is here.</a> Are you an angry company who wants to send me a mean legal letter? <a href="mailto:jake@gealer.email">Contact me here.</a></p>
                <br>
                <p><a v-on:click="suggest">Have a security fail you want to suggest? Click here to suggest it.</a></p>
            </div>
            <hr>
        </div>
        <ShameBase></ShameBase>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import SuggestionBox from "./suggestion_box"
    import ShameBase from "./shame_base"

    export default Vue.extend({
        name: "App",
        components: {
            SuggestionBox,
            ShameBase,
        },
        methods: {
            suggest() {
                this.$refs.SuggestionBox.toggle()
            },
        },
    })
</script>
