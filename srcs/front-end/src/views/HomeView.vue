<script lang="ts" setup>
import { useStore } from 'vuex';
import { onMounted } from 'vue';
import { Axios } from '../services';

const store = useStore();
const User  = store.getters.getuser;

onMounted(() => {
    Axios.get()
})

</script>

<template>
  <div class="hello">
    <h1>Welcome to our Pong</h1>
    <p>
     To play, please click on the button just below.
    </p>
    <p>You will be redirected in a matchmaking room.</p>
    <router-link to="/matchmaking" class="button">
      <button class="play">
         Let's play
      </button>
    </router-link>
    <p>Your ID is {{ User.id }}</p>

  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
button {
  margin: 100px 0 0;
  font-size: 30px;
  background-color: #4395c5;
  color: #1a4258;
	border: 1px solid #1a4258;
	border-radius: 8px;
  text-align: center;
  padding: 15px 32px;
  transition: 0.1s ease-in-out;
  &:hover{
    border: 3px solid #2d4b5c;
    background-color: #5b9abe;
  }
}
p {
  list-style-type: none;
  padding: 0.5rem;
}
h1 {
  padding: 2rem 0rem 5rem;
}

</style>
