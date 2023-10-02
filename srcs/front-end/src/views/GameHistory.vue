<script setup lang="ts">
import router from '../router';
import Axios from '../services'
import { ref, onMounted } from 'vue';

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
    await Axios.post('game/Findbyname', { name: name.value }).then(res => {
        if (res.status == 201) {
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
            <button type="submit">Research</button>
        </form>
    </div>
    <div v-if="reseach === false">
        <h3> GameHistory</h3>
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
    <div v-else>
        <h3> GameResearch</h3>
        <div v-for="name in gamesre">
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
</template>


<style lang="scss" scoped>
.reseach {
    padding: 2rem;
    button {
        background-color: #bfc7cb;
        color: #141d22;
        border: 1px solid #1a4258;
        border-radius: 8px;
        text-align: center;
        padding: 7px 10px;
        transition: 0.1s ease-in-out;
        font-size: 0.7rem;

        &:hover {
        border: 2px solid #131719;
        background-color: #4ade80;;
        }
    }
}

span {
    gap: 2;
}

input[type="text"] {
      width:200px;
	  margin-top: 0.4rem;
      height:25px;
      border-radius:3px;
      background-color: rgb(237, 239, 239);
      margin-left:2px;
	 
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