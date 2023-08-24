<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {io} from 'socket.io-client'

// The important part: the name of the variable needs to be equal to the ref's name of the canvas element in the template
const canvasElement: Ref<HTMLCanvasElement | undefined> = ref();
const context: Ref<CanvasRenderingContext2D | undefined> = ref();
const socket = io('http://localhost:3000/game')
const paddle = ref({
        x: 30,
        y :0,
        w : 15,
        h : 100,
        color : 'white',
        score : 0,
});
const com = ref({
        x: 30,
        y : 0,
        w : 15,
        h : 100,
        color : 'white',
        score : 0,
});
const ball = ref({
        x: 0,
        y : 0,
        r : 10,
        speed : 2,
        velX : 5,
        velY : 0,
        color : 'blue',
});

onMounted(() => {
    context.value = canvasElement.value?.getContext('2d') || undefined;
    canvasElement.value?.addEventListener("mousemove",Updatexy);
    console.log(canvasElement.value);
    if(!canvasElement.value){
        return;
    }
    paddle.value.y =  canvasElement.value.height/2 - 100/2;
    com.value.y = canvasElement.value.height/2 - 100/2,
    com.value.x = canvasElement.value.width-30-15,
    ball.value.x = canvasElement.value.width/2,
    ball.value.y = canvasElement.value.height/2
    console.log(socket);
});

socket.emit('message');
socket.on('connected',(response : string) => {
    console.log(response);
});

setInterval(game,1000/60);

function game()
{
    update();
    render();
};

function collition(bal : any,play : any){
    var ballc = {
        top:0,
        bot:0,
        l:0,
        r:0,
    };
    var playC ={
        top:0,
        bot:0,
        l:0,
        r:0,
    };
    
    ballc.top = bal.value.y - bal.value.r;
    ballc.bot = bal.value.y + bal.value.r;
    ballc.l = bal.value.x - bal.value.r;
    ballc.r = bal.value.x + bal.value.r;
    
    playC.top = play.value.y;
    playC.bot = play.value.y + play.value.h;
    playC.l = play.value.x;
    playC.r = play.value.x + play.value.w;

    return playC.l < ballc.r && playC.top < ballc.bot && playC.r > ballc.l && playC.bot > ballc.top;
};

function update(){
    ball.value.x += ball.value.velX;
    ball.value.y += ball.value.velY;

    let comlel = 0.1;
    com.value.y += (ball.value.y - (com.value.y + com.value.h/2)) * comlel;
    if(ball.value.y + ball.value.r > canvasElement.value?.height || ball.value.y - ball.value.r < 0){
        ball.value.velY = -ball.value.velY;
    }
    let player = (ball.value.x < canvasElement.value?.width/2) ? paddle : com;

    if(collition(ball,player))
    {
        let colpoint = ball.value.y - (player.value.y + player.value.h/2);
        colpoint = colpoint/(player.value.h/2);
        let anglered = colpoint * (Math.PI/4);

        let dir = (ball.value.x < canvasElement.value?.width/2) ? 1 : -1;
        ball.value.velX = dir * ball.value.speed * Math.cos(anglered);
        ball.value.velY = ball.value.speed * Math.sin(anglered);
        if(ball.value.speed < 12)
            ball.value.speed += 0.5;
    }

    if(ball.value.x - ball.value.r < 0)
    {
        com.value.score++;
        resetball();
    }
    else if (ball.value.x + ball.value.r > canvasElement.value?.width)
    {
        paddle.value.score++;
        resetball();
    }
}

function resetball()
{
    ball.value.x = canvasElement.value.width/2;
    ball.value.y = canvasElement.value.height/2;
    ball.value.speed = 5;
    ball.value.velX = -ball.value.velX;
}

function Updatexy(e){
    if(!canvasElement.value){
        return;
    }
    let rect = canvasElement.value.getBoundingClientRect();
    paddle.value.y = e.y - rect.top - paddle.value.h/2;
};

function render() {
    if (!context.value) {
        return;
    }
    drowpaddle(0,0,canvasElement.value?.width,canvasElement.value?.height,'black');
    drawText(paddle.value.score,canvasElement.value?.width/4,canvasElement.value?.height/5);
    drawText(com.value.score,3*canvasElement.value?.width/4,canvasElement.value?.height/5);
    drowpaddle(paddle.value.x,paddle.value.y,paddle.value.w,paddle.value.h,paddle.value.color);
    drowpaddle(com.value.x,com.value.y,com.value.w,com.value.h,com.value.color);
    drowball(ball.value.x,ball.value.y,ball.value.r,ball.value.color);
};

function drawText(text : string ,x : number ,y : number){
    if (!context.value) {
        return;
    }
    context.value.fillStyle = "#FFF";
    context.value.font = "75px fantasy";
    context.value.fillText(text, x, y);
}

function drowpaddle(x,y,w,h,color)
{
    if (!context.value) {
        return;
    }
    context.value.fillStyle = color;
    context.value.fillRect(x,y,w,h);
}

function drowball(x,y,r,color)
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
    <div>
        <canvas ref="canvasElement" width="600" height="400" style="border: 2px solid #ffffff"></canvas>
    </div>
</template>


<style>

canvas#responsive-canvas {
    display: flex;
      width: 34rem;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      z-index: -1;
    }

</style>