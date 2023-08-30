<script setup lang="ts">
import {onMounted,onBeforeMount, Ref, ref , onUnmounted} from "vue";
import {io} from 'socket.io-client'


// The important part: the name of the variable needs to be equal to the ref's name of the canvas element in the template
const canvasElement: Ref<HTMLCanvasElement | undefined> = ref();
const context: Ref<CanvasRenderingContext2D | undefined> = ref();
const socket = io('http://localhost:3000/game');
const ball = ref({
        x: 0,
        y : 0,
        r : 0,
        speed : 2,
        velX : 2,
        velY : 0,
        color : 'blue',
});

onUnmounted(() => {
    socket.disconnect();
    console.log("LEAVE");
    socket.on("ball",() => {
        render();
    })
}),

onBeforeMount(() => {
    console.log('Here');
    socket.on('ball' , () => {
        render()
    })
    socket.connect();
}),

onMounted(() => {
    context.value = canvasElement.value?.getContext('2d') || undefined;
    ball.value.r= 5;
    socket.emit('message');
    render();
});
function render() {
    console.log("tic")
    if(!canvasElement.value)
        return 
    if (!context.value) {
        return;
    }
    clearCanvas(0,0,canvasElement.value?.width,canvasElement.value?.height,'black');
    drowball(ball.value.x,ball.value.y,ball.value.r,ball.value.color);
};

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
    max-width: 70vw;
    max-height: 80vh;
    justify-content: center;
    border: solid greenyellow;
}
</style>