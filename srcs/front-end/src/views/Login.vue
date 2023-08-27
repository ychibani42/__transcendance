<script setup lang="ts">
import router from '../router';
import  Axios  from '../services';
import {ref} from "vue";

const id42 = ref(0);

function login(){
    console.log("Here");
    try {
        Axios.post("auth/Inviter",id42).then(res => {
            router.push(res.data.redirect);
        } );
    } catch (error) {
        console.log(error);
    }
}

</script>


<template>
    <h1>Login</h1>
    <h2>Test</h2>
    <button><a href="http://localhost:3000/auth/42/callback">Website</a></button>
    <div>
        <form @submit.prevent="login()">
            <input type="number" name="id42" v-model="id42" required>
            <input type="submit" value="Try it">
        </form>
    </div>
        
</template>

<style>

</style>