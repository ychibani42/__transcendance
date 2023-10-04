<script setup lang="ts">
import Axios from '../services';
import {onMounted, Ref, ref} from "vue";
import { useStore } from 'vuex';
import router from '../router';
import { toast } from 'vue3-toastify';

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
            if (res.data == true)
                router.push("/")
            else
            {
                toast("Wrong Code Try again",
                {
                    type : "error"
                })
            }
        } ); 
    } catch (error) {
        
    }
}

</script>
<template>
    <h1>TWO FACTOR AUTH</h1>
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
    align-items: center;
    gap: 0.5rem;
    button{
        height: 2rem;
    }
    input
    {
        height: 2rem;
        border-radius: 10px;
        padding-right: 0.5rem;
    }
    form{
        button{
            height: 2rem;
            margin-left: 1rem;
        }
    }
}
</style>