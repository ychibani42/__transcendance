<script setup lang="ts">
import router from '../router';
import Axios from '../services'
import { ref, onMounted} from 'vue';

const games = ref([])
const gamesre = ref([])
const reseach = ref(false)
const name = ref('')

onMounted(() => {
    GetGames()
})

async function GetGames() {
    await Axios.get('game/all').then(res => {
        games.value = res.data
    })
}

async function research() {
    await Axios.post('game/Findbyname', {name : name.value}).then(res => {
        if(res.status == 201)
        {
            gamesre.value = res.data
            reseach.value = true
        }
    })
}

</script>

<template>
    <div>
        <form class="reseach" @submit.prevent="research()">
            <input type="text" placeholder="Enter a name" v-model="name" required>
            <input type="submit" value="Research">
        </form>
    </div>
    <div v-if="reseach === false">
        <h1> GameHistory</h1>
        <div v-for="name in games">
            <span v-if="name.score[0] == 5"> Winner {{ name.user1.name }} | {{ name.score[0] }} : {{ name.score[1] }} | {{ name.user2.name }} Looser</span>
            <span v-else> Looser {{ name.user1.name }} | {{ name.score[0] }} : {{ name.score[1] }} | {{ name.user2.name }} Winner</span>
        </div>
    </div>
    <div v-else>
        <h1> GameResearch</h1>
        <div v-for="name in gamesre">
            <span v-if="name.score[0] == 5"> Winner {{ name.user1.name }} | {{ name.score[0] }} : {{ name.score[1] }} | {{ name.user2.name }} Looser</span>
            <span v-else> Looser {{ name.user1.name }} | {{ name.score[0] }} : {{ name.score[1] }} | {{ name.user2.name }} Winner</span>
        </div>
    </div>
    
</template>


<style scoped>
.reseach{
    padding: 2rem;
}

span{
    gap: 2;
}
</style>