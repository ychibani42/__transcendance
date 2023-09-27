<script setup lang="ts">

import Axios from '../services'
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const games = ref([])
const gamesre = ref([])
const name = ref('')
const store = useStore()


async function GetGames(usersname:string) {
    await Axios.post('game/Findbyname', {
        name: usersname })
    .then(res => {
        games.value = res.data
    })
}

onMounted(() => {
    name.value = store.state.user.username;
    GetGames(name.value)
});

</script>


<template>
        <h1> GameHistory</h1>
        <div v-for="name in games">
            <span v-if="name.score[0] == 5"> Winner {{ name.user1.name }} | {{ name.score[0] }} : {{ name.score[1] }} | {{
                name.user2.name }} Looser </span>
            <span v-else> Looser {{ name.user1.name }} | {{ name.score[0] }} : {{ name.score[1] }} | {{ name.user2.name }}
                Winner</span>
        </div>
</template>


<style scoped>
.reseach {
    padding: 2rem;
}

span {
    gap: 2;
}
</style>