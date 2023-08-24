<script>
import PrivateNav from '../components/PrivateNav.vue'
export default {
  name: 'Home',
  components : { PrivateNav },
}
</script>

<template>
    <div>
      <PrivateNav/>
      Home Test
      
    <router-view/>
  </div>
</template>
