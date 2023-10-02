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
    <div class="gamehistory">
        <h3> GameHistory</h3>
            <div v-if="games.length == 0">
                <span> No game played </span>
            </div>
        <div v-else>
            <div v-for="name in games">
           
                <span v-if="name.score[0] == 5">  
                    <div class="scores">
                        <div class="first_player"> 
                            <div class="left-winner"> Winner</div> 
                            <div class="name">{{ name.user1.name }}</div> 
                        </div> 
                        <div class="score"> | {{ name.score[0] }} : {{ name.score[1] }} |</div>
                        <div class="second_player"> 
                            <div class="right-name">{{ name.user2.name }}</div> 
                            <div class="right-loser">Loser</div>  
                           
                        </div>  
                    </div>
                </span>
                <span v-else> 
                    <div class="scores">
                        <div class="first_player"> 
                            <div class="left-loser">Loser </div>
                            <div class="name">{{ name.user1.name }}</div> 
                        </div> 
                        <div class="score"> | {{ name.score[0] }} : {{ name.score[1] }} |</div>
                        <div class="second_player"> 
                            <div class="right-name">{{ name.user2.name }} </div> 
                            <div class="right-winner">Winner</div> 
                            
                        </div>  
                    </div>
                </span>
            </div>
        </div>
    </div>
     
</template>


<style lang="scss" scoped>

.gamehistory {
    margin-top: 5rem;
    overflow-y: auto;
    height: 100%;
    width: 100%;
}
.reseach {
    padding: 2rem;
}

span {
    gap: 2;
}

.scores {
    display: flex;
    margin-top: 3px;
}

.first_player{
    display: flex;
    width: 33%;
    .left-winner {
        color: #4ade80;
    }
    .left-loser {
        color: #d91b1b;
    }
    .name {
        margin-left: 2rem;
        margin-right: 2rem;
    }
}

.score {
    width: 33%;
}

.second_player{
    width: 33%;
    display: flex;
    justify-content: flex-end;
    .right-winner {
        color: #4ade80;
       
    }
    .right-loser {
        color: #d91b1b;
    }

}
.right-name {
    margin-right: 2rem;
}

</style>