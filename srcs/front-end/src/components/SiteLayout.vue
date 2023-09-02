<template>
    <div class="app">
      <div class="sidebar">
        <SideBar/>
      </div> 
      <div class="component">
        <router-view/>
      </div> 
    </div>
</template>
  
  
  
  <script lang="ts">
  import SideBar from './SideBar.vue';
  export default {
      name : 'SiteLayout',
      components : {
          SideBar
      }
  }
  </script>
  
  <style lang="scss">
  body {
    margin: 0;
  }
  
  
  .app {
  
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    height: 100vh;
    .component {
      flex:content;
    }
  }
  </style>