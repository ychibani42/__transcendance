<template>
  <div class="app">
    <div class="sidebar"><SideBar /></div> 
    <div class="component"><router-view/></div> 
     
  </div>
  
</template>



<script lang="ts" setup>
import SideBar from './components/SideBar.vue';
</script>

<style lang="scss">



body {
  margin: 0;
}


.app {

  display: flex;
  flex-wrap: wrap;
  .component {
    margin: 2rem;
  }
}
  .app > div {
    flex: 1 1, auto;
  }

</style>
