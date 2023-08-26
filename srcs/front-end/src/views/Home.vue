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
    <router-view/>
  </div>
</template>
