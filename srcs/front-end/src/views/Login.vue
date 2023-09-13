<script setup lang="ts">
import router from '../router';
import  Axios  from '../services';
import {ref} from "vue";

const id42 = ref(0);


function login(){
    console.log("Here");
    try {
        Axios.post("auth/Inviter",{id42}).then(res => {
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
        <form action="http://localhost:3000/auth/42/callback">
            <button class="btn" type="submit">LOG 42</button>
        </form>
        <form class="form" @submit.prevent="login()" style="inline">
            <span>Insert ID</span>
            <input class="input" type="number" name="id42" v-model="id42" text="Number" required>
            <input class="input" type="submit" value="Try it">
        </form>
    </div>
</template>

<style scoped>

/* Style général du conteneur de connexion */
.Log {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f2f2f2;
    border-radius: 12px;
}
/* Style du titre */
h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 1rem;
}

a{
    color: white;
}

/* Style du bouton Log With 42 */
.btn {
    background-color: #3498db;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #2980b9;
    color:gold;
    border-color: gold;
    border: 2px;
}

/* Style du formulaire */
.form {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    width: 100%;
    max-width: 300px;
}

/* Style des labels et inputs */
.form span {
    font-size: 1rem;
    margin-bottom: 8px;
}

.input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.input[type="submit"] {
    background-color: #2ecc71;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.input[type="submit"]:hover {
    background-color: #27ae60;
}

</style>