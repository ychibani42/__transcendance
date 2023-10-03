
<template>
    <div class="profile">
        <div class="picture">
        <label for="fileField">
            <img :src="picture" class="img_class">
        </label>
        </div>
        <div class="name"> <h2>{{ name }}</h2></div>
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
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Axios from '../services';
import { useRoute } from 'vue-router';
import History from '../components/History.vue';
import router from '../router';


const routes = useRoute()
const name = ref()
const picture = ref()
const con = ref(0);
const id = ref(useRoute().params.id);
const games = ref([])


onMounted(() => {
    fetchUser(routes.params.id);
    getPictureBeforeMount();
})

async function GetGames(usersname: string) {
    await Axios.post('game/Findbyname', {
        name: usersname
    })
        .then(res => {
            games.value = res.data
        })
}

async function fetchUser(id: number) {
    await Axios.get('users/fetch/' + id).then((res) => {
        name.value = res.data.name;
        if (res.status === 200) {
            name.value = res.data.name;
        }
        else {
            router.push('/Home')
        }
    }).then(() => {
        GetGames(name.value)
    })
}

const getPictureBeforeMount = async () => {
    try {
        const res = await Axios.get('auth/Me');
        if (res.status === 200) {
            con.value = routes.params.id;
            getPicture();
        }
    } catch (error) {
        console.error(error);
    }
};

const getPicture = async () => {
    try {
        const res = await Axios.get(`users/picture/${con.value}`, {
            responseType: 'blob',
        });
        const blob = res.data;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            picture.value = reader.result;
        };
    } catch (error) {
        console.error(error);
    }
};

</script>

<style lang="scss" scoped>
.profile {
    display: flex;
    flex-direction: column;
    align-content:flex-start;
    flex-wrap: nowrap;
    align-items: center;
	
    h1{
        padding:3px;
    }
}



.picture {
    margin-top: 2rem;
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #111;
    cursor: pointer; /* Add cursor pointer for better UX */
  }
  
  
  .img_class {
    object-fit: cover;
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
    width: 100%;
    height: 100%;
  }

.gamehistory {
    margin-top: 5rem;
    overflow-y: auto;
    height: 100%;
    width: 100%;
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