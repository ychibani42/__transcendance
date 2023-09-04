<script setup lang="ts">
import {onMounted,onBeforeMount, Ref, ref , onUnmounted, computed} from "vue";
import {Socket, io} from 'socket.io-client'
import { useRouter } from "vue-router";
import { useStore } from "vuex";


const router = useRouter()
const state = useStore()
const socket: Ref<Socket> = ref() 
const canvasElement: Ref<HTMLCanvasElement | undefined> = ref();
const context: Ref<CanvasRenderingContext2D | undefined> = ref();

const ball = ref({
        x: 0,
        y : 0,
        r : 0,
        speed : 2,
        velX : 2,
        velY : 0,
        color : 'blue',
});

const paddle = ref({
        x: 15,
        y : 75,
        w : 8,
        h : 37,
        color : 'red',
        score : 0,
});

const com = ref({
        x: 300 - 15 - 8,
        y : 0,
        w : 8,
        h : 37,
        color : 'red',
        score : 0,
});

onUnmounted(() => {
    socket.value.disconnect();
    console.log("LEAVE");
}),

onBeforeMount(() => {
    console.log('Here');
    state.commit('setGamesocket',io('http://localhost:3000/game'))
    socket.value = state.state.gamesock
    socket.value.on('ball' , (arg1 : number, arg2 : number ) => {
        ball.value.x = arg1
        ball.value.y = arg2
        render()
    })
    socket.value.on('com', (arg1 : number, arg2 : number , arg3: number ) => {
        com.value.y = arg1
        com.value.score = arg2
        paddle.value.score = arg3
    })
    socket.value.on('update', () => {
        canvasElement.value?.addEventListener("mousemove",Updatexy);
    })
    socket.value.on('play',(arg1 : number) => {
        paddle.value.y = arg1
    })
    socket.value.on('finish',() => {
        console.log("finish")
        router.push('/')
    })
    socket.value.connect();
}),

onMounted(() => {
    context.value = canvasElement.value?.getContext('2d') || undefined;
    ball.value.r= 5;
    socket.value.emit('message');
    render();
});

function render() {
    if(!canvasElement.value)
        return 
    if (!context.value) {
        return;
    }
    clearCanvas(0,0,canvasElement.value?.width,canvasElement.value?.height,'black');
    drawText(paddle.value.score,canvasElement.value?.width/4,canvasElement.value?.height/5);
    drawText(com.value.score,3*canvasElement.value?.width/4,canvasElement.value?.height/5);
    drowball(ball.value.x,ball.value.y,ball.value.r,ball.value.color);
    drowpaddle(com.value.x,com.value.y,com.value.w,com.value.h,com.value.color);
    drowpaddle(paddle.value.x,paddle.value.y,paddle.value.w,paddle.value.h,paddle.value.color); 
};

function Updatexy(e : any){
    if(!canvasElement.value){
        return;
    }
    let rect = canvasElement.value.getBoundingClientRect();
    paddle.value.y = ((e.y - rect.top) / (rect.height/150)) - paddle.value.h/2;
    if(paddle.value.y < 0)
        paddle.value.y = 0;
    if(paddle.value.y > canvasElement.value.height - paddle.value.h)
    {
        paddle.value.y = canvasElement.value.height - paddle.value.h
    }
    socket.value.emit('position',paddle.value.y)
};

function drawText(text : number,x : number ,y : number){
    if (!context.value) {
        return;
    }
    context.value.fillStyle = "#FFF";
    context.value.font = "20px fantasy";
    context.value.fillText(text, x, y);
}

function drowpaddle(x: number,y: number,w: number,h: number,color: string)
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
    min-width: 60vw;
    min-height: 60vh;
    max-width: 80vw;
    max-height: 80vw;
    justify-content: center;
    border: solid greenyellow;
}
</style>