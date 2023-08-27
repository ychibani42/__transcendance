<template>
  <div class="app">
 
    <router-view/>   
  
  </div>
  <SideBar />
</template>



<script lang="ts" setup>
import SideBar from './components/SideBar.vue';
</script>

<style lang="scss">

nav a.router-link-exact-active {
  color: #42b983;
}

:root {
  --primary: #4ade80;
  --grey: #64748b;
  --dark: #1e293b;
  --darkalt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 300px;
}

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;

  @media (max-width: 2048px) {
      top: 15%;
      left: 10%;
      position: absolute;
    }
  }

</style>
