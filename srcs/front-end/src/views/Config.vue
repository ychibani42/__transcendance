<script setup lang="ts">
import router from '../router';
import Axios from '../services'
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const User = store.getters.getuser;
const name = ref('');
const err = ref(false);

async function setupname() {
    const sendname = name.value
    const id = User.id
    await Axios.post('users/Change',{id , sendname}).then(res => {
            router.push("/")
            err.value = true
    })
}
</script>

<template>
    <div>
        <h1>Setup Your Name</h1>
        <form class="Formname" @submit.prevent="setupname()">
            <input type="text" v-model="name" required>
            <button>Setup Name</button>
            <span v-if="err === true"> Username already use or invalid</span>
        </form>
    </div>
</template>


<style>
.Formname{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>