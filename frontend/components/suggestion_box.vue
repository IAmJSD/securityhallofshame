<template>
    <div :class="`modal ${toggled ? 'is-active' : ''}`">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    Suggest Some Dodgy Security Practices
                </p>
                <button class="delete" aria-label="close" @click="toggle"></button>
            </header>
            <section class="modal-card-body">
                <!-- content -->
            </section>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"

    export default Vue.extend({
        name: "SuggestionBox",
        data() {
            return {
                toggled: false,
            }
        },
        methods: {
            toggle() {
                this.$data.toggled = !this.$data.toggled
            },
        },
    })
</script>
