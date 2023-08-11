<template>
  <div class="home">
    <Welcome msg="Welcome"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Welcome from '../components/Welcome.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  components: {
    Welcome,
  },
});
</script>

<style scoped>
.home {
  margin: 0 250px 0;
}
</style>
