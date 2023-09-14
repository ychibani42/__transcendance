<script setup lang="ts">
import Axios from '../services';
import {onMounted, Ref, ref} from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore()
const User = store.getters.getuser;
const name = ref('');



function generateQRCode(){
    Axios.post('auth/Generate2FA').then((res) =>{
        if(res)
        {
            name.value = res.data
            console.log(res.data)
        }
    })
}

</script>
<template>
    <h1>TWO FACTOR AUTH</h1>
    <p>Your ID is {{ User.id }}</p>
    <div class="otp">
        <img id="qrImage" height="250" width="250" :src="name">
        <button @click="generateQRCode" class="">Generate Code</button>
        <div>
            <form action="">
                <input type="text" value="" placeholder="Enter Code">
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