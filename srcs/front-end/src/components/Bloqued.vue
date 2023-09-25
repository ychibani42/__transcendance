<script setup lang="ts">
import { useStore } from 'vuex';
import { ref , onMounted,onBeforeMount } from 'vue';
import Axios from '../services';

const ID = ref()
const Bloqued = ref()

async function getBloqued(){
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        ID.value = res.data.id
  })
  Axios.post('Bloqued',{id : ID.value}).then((res) => {
        Bloqued.value = res.data
  })
}

onMounted(() => {
  getBloqued()
});



</script>

<template>
    <div class="Bloqued">
      <ul v-for="Bloqueds in Bloqued">
        <li>{{ Bloqueds.user.name }}</li>
      </ul>
    </div>
</template>

<style scoped>

div {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  height: 15rem;
}

ul{
  list-style: none;
}
</style>