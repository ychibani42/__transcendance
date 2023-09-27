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

const ball = ref({
        x: 147,
        y : 75,
        r : 5,
        speed : 2,
        velX : 2,
        velY : 0,
        color : 'yellow',
});

const play1 = ref({
        x: 15,
        y : 75,
        w : 8,
        h : 37,
        color : 'red',
        score : 0,
});

const play2 = ref({
        x: 300 - 15 - 8,
        y : 75,
        w : 8,
        h : 37,
        color : 'red',
        score : 0,
});

const net = ref({
        x : 145,
        y : 5,
        w : 2,
        h : 5,
        color : 'white',
});

onBeforeRouteLeave((to,from) => {
    console.log(to,from)
    if(finished.value == false)
        return null
})

onUnmounted(() => {
    if(socket.value)
        socket.value.disconnect();
    if(state.state.state != null)
    {
        state.state.state.emit("Change")
    }
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
        renderfinish(arg1)
    })
    roomname.value = state.state.gamename
    myplay.value = state.state.gameplay
}),



onMounted(() => {
    context.value = canvasElement.value?.getContext('2d') || undefined;
    canvasElement.value?.addEventListener("mousemove",Updatexy);
    canvasElement.value?.addEventListener("click",ReadyOrQuit);
    render();
});

function ReadyOrQuit(){
    if(playing.value == false)
        socket.value?.emit("ready",roomname.value)
    if(finished.value == true)
        router.push('/')
}

function renderfinish(text : string){
    if(!canvasElement.value)
        return 
    if (!context.value) {
        return;
    }
    clearCanvas(0,0,canvasElement.value?.width,canvasElement.value?.height,'black');
    context.value.fillStyle = "white"
    context.value.fillText(text, 100, 75);
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
    context.value.fillStyle = color;
    context.value.fillRect(x,y,w,h);
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
    context.value.fillStyle = color;
    context.value.beginPath();
    context.value.arc(x,y,r,0,Math.PI*2,false);
    context.value.closePath();
    context.value.fill();
}
</script>

<template>
    <div class="canvasDiv">
        <h1>THE GAME</h1>
        <canvas ref = "canvasElement" id="pong"></canvas>
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
}
</style>