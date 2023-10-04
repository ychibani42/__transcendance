<script setup lang="ts">
import Picture from '../components/Picture.vue';
import router from '../router';
import Axios from '../services'
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const User = store.getters.getuser;
const name = ref('');
const err = ref(false);
const errname = ref("");

async function setupname() {
    const sendname = name.value
    const id = User.id
    await Axios.post('users/Change',{id : id , name : name.value}).then(res => {
        if(res.status == 201)    
            router.push("/")
        else
        {
            errname.value = res.data.message
            err.value = true
        }  
    })
}
</script>

<template>
    <div>
        <h1>Setup Your Name</h1>
        <form class="Formname" @submit.prevent="setupname()">
        <Picture class="place"/>
            <input type="text" v-model="name" required>
            <button>Setup Name</button>
            <span v-if="err === true"> {{errname}}</span>
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