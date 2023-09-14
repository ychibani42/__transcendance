<script setup lang="ts">
import router from '../router';
import Axios from '../services'
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const User = store.getters.getuser;
const name = ref('');

async function setupname() {
    console.log("here try")
    const sendname = name.value
    const id = User.id
    console.log(User.id)
    await Axios.post('users/Change',{id , sendname}).then(res => {
        if(res.data === true)
        {
            store.commit("setProfileC",true)
            router.push("/")
        }
    })
}
</script>

<template>
    <div>
        <h1>Setup Your Name</h1>
        <form class="Formname" @submit.prevent="setupname()">
            <input type="text" v-model="name" required>
            <button>Setup Name</button>
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