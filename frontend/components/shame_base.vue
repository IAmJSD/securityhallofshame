<template>
    <div style="padding-left: 20px; padding-right: 20px">
        <div v-for="(value, key) in d" v-bind:key="key">
            <h1 class="title">{{ key }}</h1>
            <hr style="margin: 5px">
            <dl>
                <li v-for="(v, k) in value" v-bind:key="k"><a :href="v">{{ k }}</a></li>
            </dl>
            <hr>
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
