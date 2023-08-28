<script setup lang="ts">
import router from '../router';
import  Axios  from '../services';
import {ref} from "vue";

const id42 = ref(0);
const name = ref('')

function login(){
    console.log("Here");
    try {
        Axios.post("auth/Inviter",{id42,name}).then(res => {
            router.push(res.data.redirect);
        } );
    } catch (error) {
        console.log(error);
    }
}

</script>


<template>
    <div class="Log">
        <h1>Login</h1>
        <button class="btn"><a href="http://localhost:3000/auth/42/callback">Log With 42</a></button>
        <form class="form" @submit.prevent="login()" style="inline">
            <span>Insert ID</span>
            <input class="input" type="number" name="id42" v-model="id42" text="Number" required>
            <span>Insert NAME</span>
            <input class="input" type="text" name="id42" v-model="name" required>
            <input class="input" type="submit" value="Try it">
        </form>
    </div>
</template>

<style scoped>

.btn{
    border: solid 1px black;
    background-color: aqua;
    padding: 5%;
}
.Log{
    display:grid ;
    text-align: center;
    align-items: center;
    justify-content: center;
}
.form{
    display: grid;
    margin-top: 1rem;
}
.input{
    margin-bottom: 2%;
    display: grid;
}

body{
    display: flex;
}
</style>