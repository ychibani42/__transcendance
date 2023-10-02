<script setup lang="ts">
import { onMounted,onBeforeMount, Ref, ref , onUnmounted} from "vue";
import { Socket} from 'socket.io-client'
import { useRouter , onBeforeRouteLeave} from "vue-router";
import { useStore } from "vuex";
import store from "../store";

const router = useRouter()
const state = useStore()
const socket: Ref<Socket | undefined> = ref() 
const canvasElement: Ref<HTMLCanvasElement | undefined> = ref();
const context: Ref<CanvasRenderingContext2D | undefined> = ref();
const myplay : Ref<Boolean> = ref(false)
const finished :  Ref<Boolean> = ref(false)
const playing :  Ref<Boolean> = ref(false)
const roomname : Ref<string> = ref("")
const msg = ref("You abandonned the game")

const pongBorder = ref("solid white") 
const pongBorderRadius = ref("1rem") 

const ball = ref({
        x: 147,
        y : 75,
        r : 5,
        speed : 2,
        velX : 2,
        velY : 0,
        color : 'white',
});

const play1 = ref({
        x: 15,
        y : 75,
        w : 8,
        h : 37,
        color : '#ee6363',
        score : 0,
});

const play2 = ref({
        x: 300 - 15 - 8,
        y : 75,
        w : 8,
        h : 37,
        color : 'cyan',
        score : 0,
});

const net = ref({
        x : 145,
        y : 5,
        w : 2,
        h : 5,
        color : 'white',
});

onUnmounted(() => {
    if(socket.value)
        socket.value.disconnect();
    if(state.state.state != null)
    {
        state.state.state.emit("Change")
    }
    state.state.gamesock?.disconnect()
    store.commit("setGamename","")
    store.commit("setGameID",0)
}),

onBeforeMount(() => {
    socket.value = state.state.gamesock
    if(!socket.value)
        return
    socket.value.on('pos', (arg1 : number, arg2 : number , arg3: number ) => {
        if(myplay.value == true)
            play2.value.y = arg1
        else
            play1.value.y = arg1
        ball.value.x = arg2
        ball.value.y = arg3
        render()
    })
    socket.value.on('score',(arg1 : number , arg2 : number) => {
        play1.value.score = arg1
        play2.value.score = arg2
    })
    socket.value.on('finish',(arg1 : string) => {
        console.log("finish")
        socket.value?.off("pos")
        socket.value?.off("score")
        finished.value = true
        msg.value = arg1
    })
    socket.value.on('Bug',() => {
       finished.value = true
       msg.value = "your opponent have crash"
    })
    roomname.value = state.state.gamename
    myplay.value = state.state.gameplay
    console.log("THEME", store.state.gameTheme)
    if(state.state.gameTheme == false)
    {
        net.value.color = "white"
        play1.value.color = "white"
        play2.value.color = "white"
    }
}),



onMounted(() => {
    context.value = canvasElement.value?.getContext('2d') || undefined;
    canvasElement.value?.addEventListener("mousemove",Updatexy);
    canvasElement.value?.addEventListener("click",ReadyOrQuit);
    render(); 
    if(roomname.value == "")
    {
        finished.value = true
    }
});


function ReadyOrQuit(){
    if(playing.value == false)
    {
        socket.value?.emit("ready",roomname.value)
    }
}

function render() {
    if(!canvasElement.value)
        return 
    if (!context.value) {
        return;
    }
    clearCanvas(0,0,canvasElement.value?.width,canvasElement.value?.height,'black');
    drawText(play1.value.score,canvasElement.value?.width/4,canvasElement.value?.height/5);
    drawText(play2.value.score,3*canvasElement.value?.width/4,canvasElement.value?.height/5);
    drownet()
    drowball(ball.value.x,ball.value.y,ball.value.r,ball.value.color);
    drowplay1(play2.value.x,play2.value.y,play2.value.w,play2.value.h,play2.value.color);
    drowplay1(play1.value.x,play1.value.y,play1.value.w,play1.value.h,play1.value.color); 
};

function Updatexy(e : any){
    if(!canvasElement.value || !socket.value){
        return;
    }
    let rect = canvasElement.value.getBoundingClientRect();
    let pos;
    pos = ((e.y - rect.top) / (rect.height/150)) - 37/2;
    if(pos < 0)
        pos = 0;
    if(pos > canvasElement.value.height - 37)
    {
        pos = canvasElement.value.height - 37
    }
    if(myplay.value == true) 
    {play1.value.y = pos }
    else{ play2.value.y = pos }
    socket.value.emit('position',pos,roomname.value)
};

function drownet(){
    if(!canvasElement.value)
        return
    for (let i = 0; i < canvasElement.value.height ; i+=15) {
        drowplay1(net.value.x,net.value.y + i,net.value.w,net.value.h,net.value.color)
    }
}

function drawText(text : number,x : number ,y : number){
    if (!context.value) {
        return;
    }
    context.value.fillStyle = "#FFF";
    context.value.font = "30px modern";
    context.value.fillText(text, x, y);
}

function drowplay1(x: number,y: number,w: number,h: number,color: string)
{
    if (!context.value) {
        return;
    }
    context.value.beginPath();
    if(state.state.gameTheme == false)
    {
        context.value.fillStyle = color
        context.value.fillRect(x,y,w,h);
    }    
    else
    {
        context.value.beginPath();
        context.value.shadowBlur = 8
        context.value.shadowColor = color
        context.value.strokeStyle = color
        context.value.lineWidth = 2
        context.value.rect(x,y,w - 2,h -2)
        context.value.stroke()
    }
    context.value.closePath();
    context.value.lineWidth = 0
}

function clearCanvas(x: number,y: number,w: number,h: number,color: string){
    if (!context.value) {
        return;
    }
    context.value.fillStyle = color;
    context.value.fillRect(x,y,w,h);
}
function drowball(x: number,y: number,r: number,color: string)
{
    if (!context.value) {
        return;
    } 
    context.value.beginPath();
    if(state.state.gameTheme == false)
    {
        context.value.arc(x,y,r,0,Math.PI*2,false);
        context.value.fillStyle = 'white';
        context.value.fill();   
    }    
    else
    {
        context.value.arc(x,y,r-2,0,Math.PI*2,false);
        context.value.fillStyle = 'white';
        context.value.fill(); 
        context.value.shadowColor = 'white'
        context.value.shadowBlur = 2
        context.value.lineWidth = 2
        context.value.strokeStyle = 'cyan';
        context.value.stroke()
    }
    context.value.closePath();
}


onBeforeRouteLeave((to,from,next) => {
    if(finished.value == false)
    {
        const answer = window.confirm('You gonna Quit the Queue, Are you sure?')
        if(answer == false)
            return
        else
        {
            store.state.gamesock?.disconnect()
            store.commit('setGamename',"")
            next() 
        }    
    }
    else
    {
        store.state.gamesock?.disconnect()
        store.commit('setGamename',"")
        next()
    }
})

function redir()
{
    router.push("/")
}

</script>

<template>
    <div class="canvasDiv">
        <h1>THE GAME</h1>
        <canvas :style="{'border': pongBorder, 'border-radius': pongBorderRadius}" ref="canvasElement" id="pong"></canvas>
    </div>
    <div class="modal" v-if="finished == true">
        <div class="block">
             <h1 class="title">{{ msg }}</h1>
            <button class="modal-btn" v-on:click="redir()">Go to Home</button>
        </div>   
    </div>
   
</template>

<style scoped>

h1 {
    display: inline;
    margin: 1%;
}
.canvasDiv{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin: 2%;
}

canvas {
    display: flex;
    height: 100%;
    width: 100%;
    min-width: 50vw;
    min-height: 50vh;
    max-width: 80vw;
    max-height: 80vw;
    justify-content: center;
    color:cyan;
}

.block{
    position: fixed;
    top: 30%;
    bottom: 0;
    left: 30%;
    right: 0;
    z-index: 15;
    width: 50%;
    height: 50%;
    background-color: rgba(253, 168, 168, 1);
    display: flex;

    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
}
.modal {

    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 15;
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;

    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  .title{
        color: chocolate;
        border: solid ;
    }
    .modal-btn {
    width: 15rem;
    height: 3rem;
    margin: 0.2rem;
  }
}
</style>