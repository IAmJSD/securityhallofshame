<template>
    <div>
        <SuggestionBox ref="SuggestionBox"></SuggestionBox>
        <div style="padding-top: 20px">
            <div style="text-align: center">
                <h1 class="title">Security Hall Of Shame</h1>
                <p><a v-on:click="suggest">Have a security fail you want to suggest? Click here to suggest it.</a></p>
            </div>
            <hr>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import SuggestionBox from "./suggestion_box"

    export default Vue.extend({
        name: "App",
        components: {
            SuggestionBox,
        },
        methods: {
            suggest() {
                this.$refs.SuggestionBox.toggle()
            },
        },
    })
</script>
