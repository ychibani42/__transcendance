
<script setup lang="ts">
import { io , Socket} from 'socket.io-client';
import { Ref, ref, onUnmounted} from "vue";
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useStore } from 'vuex';

const socket : Ref<Socket | undefined> = ref()
const socket2: Ref<Socket | undefined> = ref()
const store = useStore()
const router = useRouter()
const User = store.getters.getuser
const option = ref(false)
const theme = ref(false)
const speed = ref('')
const onQueue = ref(false)
const Quit = ref(false)



inviteorNormal()

function inviteorNormal()
{
    if(store.state.gamename == "")
        debut()
    else
        invitedgame()
}

function invitedgame(){
    console.log("invited")
    option.value = true
    socket.value = store.state.gamesock
    store.state.state.emit('game')
    socket.value?.on('OnRoom', () =>
    {
        router.push("/game")
    })
    socket.value?.on('Leave', () =>
    {
        option.value = false
        store.commit('setGamename',"")
    })
    onQueue.value = true
}

function debut(){
   
    socket.value = io('http://localhost:3000/game') 
    store.commit('setGamesocket',socket)
    socket.value.on('onQueue', () => {
        onQueue.value = true
    })
    socket.value.on("playerdef", (arg1 : number , arg2 : string) => {
        if(arg1 == 1)
            store.commit('setGameplay',false)
        else
            store.commit('setGameplay',true)
        store.commit('setGamename',arg2)
    })
    socket.value.on('OnRoom', () =>
    {
        router.push("/game")
        
    })
    socket.value.on('config', () =>
    {
        store.state.state.emit('game')
        option.value = true
    })
    socket.value.on('Leave', () =>
    {
        option.value = false
        store.commit('setGamename',"")
    })
}


function joinQueue(){
    socket.value?.emit("JoinQueue",store.state.user.id)
}

function ConfigGame(){
    if(speed.value == 'true')
        socket.value?.emit("Config",true,store.state.gamename)
    else
        socket.value?.emit("Config",false,store.state.gamename)
    store.commit('setTheme',theme.value)
}

onUnmounted(()=> {
    if(store.state.gamename == "")
        store.state.gamesock.disconnect()
}),

onBeforeRouteLeave((to,from,next) => {
    if(onQueue.value == true )
    {
        if(to.path !== "/game"){
            const answer = window.confirm('You gonna Quit the Queue, Are you sure?')
            if(answer == false)
                return
            else
            {
                socket2.value?.emit("Change")
                store.state.gamesock.disconnect()
                store.commit('setGamename',"")
                next()
            }
        }
        else 
        {
            socket2.value?.emit("Change")
            next()
        }
    }
    else
    {
        socket2.value?.emit("Change")
        next()
    }
})

</script>

<template>
    <div class="all">
    <div class="Queue" v-if="option == false">
        <div class="matchmaking">
        <h4>Click to join Queue</h4>
        </div>
        <div class="button">
            <button class="button" @click="joinQueue()">Join Queue</button>
        </div>
    </div>
    <div class="Option" v-else>
        <h2>Choose Your option</h2>
        <div class="Option">
            <form @submit.prevent="ConfigGame()">
                <div v-if="store.state.gameplay === true" class="OptionBoX">
                    <label for="speed">
                        Acceleration speedball
                        <input type="checkbox"  v-model="speed" true-value="true" false-value="fasle">
                    </label>
                </div>
                <div class="theme">
                    
                    <label for="theme">
                        Classic
                        <input type="radio" id="theme" name="theme" value="true"  v-model="theme" placeholder="CLassic" required/>
                    </label>
                </div>
                <div class="theme">
                   <label for="theme"> 
                        Color
                        <input type="radio" id="theme" name="theme" value="false" v-model="theme" required/>
                    </label>
                </div>
                <input type="submit" value="Validate">
            </form>
        </div>
    </div>
    <p>Your ID is {{ User.id }}</p>
    </div>
  </template>
  
  <style lang="scss" scoped>

  .OptionBoX{
    width: 100%;
    display: flex;
    justify-content: center;
    label{
        display: flex;
        align-items: center;
        height: 2rem;
        width: 100%;
        justify-content: center;
        input{
            height: 2rem;
            width: 2rem;
        }
    }
  }
  .theme{
    width: 100%;
    display: flex;
    justify-content: center;
    label{
        display: flex;
        align-items: center;
        height: 2rem;
        width: 100%;
        justify-content: center;
        input{
        height: 2rem;
        width: 2rem;
        }
    }
    
  }

  </style>
  