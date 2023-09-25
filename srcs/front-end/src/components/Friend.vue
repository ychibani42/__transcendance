<script setup lang="ts">
import { useStore } from 'vuex';
import { ref , onMounted,onBeforeMount } from 'vue';
import Axios from '../services';

const ID = ref()
const friend = ref([])

async function getFriend(){
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        ID.value = res.data.id
  })
  Axios.post('friend',{id : ID.value}).then((res) => {
        friend.value = res.data
  })
}

onMounted(() => {
  getFriend()
});



</script>

<template>
    <div class="friend">
      <ul v-for="friends in friend">
        <li>{{ friends.user.name }}</li>
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