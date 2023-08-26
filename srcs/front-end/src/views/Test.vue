<script setup lang="ts">
import Axios from "../services";
import {onMounted, Ref, ref} from "vue";


// The important part: the name of the variable needs to be equal to the ref's name of the canvas element in the template
const canvasElement: Ref<HTMLCanvasElement | undefined> = ref();
const context: Ref<CanvasRenderingContext2D | undefined> = ref();
var text = ref("lol1");

onMounted(() => {
    context.value = canvasElement.value?.getContext('2d') || undefined;
    console.log(canvasElement.value);
    if(!canvasElement.value){
        return;
    }
    console.log(canvasElement.value.height,canvasElement.value.width);
    console.log(decodeURIComponent(document.cookie));
});

function getre(){
   
    try {
        Axios.get("/auth").then(response => (text.value = response.data));
    } catch (error) {
    }
}

</script>

<template>
   <canvas ref = "canvasElement" class="mx-5 my-5" id="pong"></canvas>
   <h1>{{ text }}</h1>
   <button @click="getre">try</button>
</template>

<style scoped>
/*
body {
  margin: 0;
  display: flex;
  justify-content: center;
  background-color: #121212;
}
*/

canvas {
    height: 100%;
    width: 100%;
    min-width: 80vw;
    min-height: 50vh;
    max-width: 100vw;
    max-height: 100vh;
    justify-content: center;
    border: solid white;
}
</style>