<script setup lang="ts">
import Axios from '../services';
import {onMounted, Ref, ref} from "vue";
import { useStore } from 'vuex';
import router from '../router';

const store = useStore()
const User = store.getters.getuser;
const name = ref('');
const code = ref('');

onMounted(()=>{
    generateQRCode()
})

function generateQRCode(){
    Axios.post('auth/Generate2FA').then((res) =>{
        if(res)
        {
            name.value = res.data
        }
    })
}

function sendcode(){
    try {
        Axios.post("auth/Verify2FA",{code : code.value}).then(res => {
            console.log(res.data)
            if(res.data == true)
                router.push("/")
        } ); 
    } catch (error) {
        
    }
}

</script>
<template>
    <h1>TWO FACTOR AUTH</h1>
    <p>Your ID is {{ User.id }}</p>
    <div class="otp">
        <img id="qrImage" height="250" width="250" :src="name">
        <button @click="generateQRCode" class="">Generate Code</button>
        <div>
            <form class="form" @submit.prevent="sendcode()">
                <input type="text" v-model="code" placeholder="Enter Code" >
                <button type="submit" class="btn btn-primary">Valid Code</button>
            </form>
        </div>
    </div>
</template>
<style lang="scss" scoped>

.otp{
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    flex-direction: column;
}
</style>