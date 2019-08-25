<template>
    <div style="padding-left: 20px; padding-right: 20px">
        <div v-for="(value, key) in d" v-bind:key="key">
            <h1 class="title is-4">{{ key }}</h1>
            <hr style="margin: 5px; margin-bottom: 30px">
            <dl>
                <li v-for="(v, k) in value" v-bind:key="k"><a :href="v">{{ k }}</a></li>
            </dl>
            <hr style="margin-top: 30px">
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import d from "../data"

    export default Vue.extend({
        name: "ShameBase",
        data() {
            return {
                d,
            }
        },
    })
</script>
