<script setup lang="ts">
import { io } from 'socket.io-client';
import {onMounted,onBeforeMount, Ref, ref , onUnmounted, computed} from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const socket: Ref<Socket> = ref()
const store = useStore()

onMounted(() =>{
    store.commit('setGamesocket',io('http://localhost:3000/game'))
    socket.value = store.state.gamesock
    socket.value.connect();
    socket.value.on('onQueue', () =>
    {
        console.log("ON QUEUE")
    })
    socket.value.on('onRoom', () =>
    {
        console.log("ON ROOM")
    })
})

function joinQueue(){
    console.log("HERE")
    socket.value.emit("JoinQueue",store.state.user.id)
}

</script>

<template>
    <div class="btn">
        <button class="btn" v-on="joinQueue"></button>
    </div>
</template>

<style>
</style>