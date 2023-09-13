<script setup lang="ts">
import Axios from '../services';
import {onMounted, Ref, ref} from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore()
const User = store.getters.getuser;
const name = ref('');

</script>
<template>
    <div>
        <h1>TWO FACTOR AUTH</h1>
        <p>Your ID is {{ User.id }}</p>
    </div>
</template>
<style lang="">
    
</style>