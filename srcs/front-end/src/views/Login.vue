<script setup lang="ts">
import router from '../router';
import  Axios  from '../services';
import {ref} from "vue";

const id42 = ref(0);


function login(){
    try {
        Axios.post("auth/Inviter",{id: id42.value}).then(res => {
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

<style lang="scss" scoped>

/* Style général du conteneur de connexion */
.Log {
    margin-top: 15rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #000000;
    height: 100%;
    width: 100%;
}
/* Style du titre */
h1 {
    font-size: 2rem;
    color: #ffffff;
    margin-bottom: 1rem;
}

a{
    color: white;
}

/* Style du bouton Log With 42 */
button {

                width: 100%;
                background-color: #bfc7cb;
                color: #141d22;
                border: 1px solid #1a4258;
                border-radius: 8px;
                text-align: center;
                padding: 20px 32px;
                transition: 0.1s ease-in-out;


                &:hover {
                    border: 2px solid #131719;
                    background-color: #4ade80;;
                }
            }

// .btn:hover {
//     background-color: #2980b9;
//     color:gold;
//     border-color: gold;
//     border: 2px;
// }

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