<script setup lang="ts">
import  Axios  from '../services';
import {onMounted, Ref, ref} from "vue";

const id42 = ref(0);

function login(){
    try {
        Axios.post("auth/Inviter",id42);
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
        <form @submit.prevent="login">
            <input type="number" name="id42" v-model="id42" required>
            <input type="submit" value="Try it">
        </form>
    </div>
        
</template>

<style>

</style>