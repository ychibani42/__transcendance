<script lang="ts" setup>
import { useStore } from 'vuex';
import { io, Socket } from 'socket.io-client';
import { Ref, ref, onMounted } from "vue";
import Friend from '../components/Friend.vue';
import Users from '../components/User.vue';
import BloquedComp from '../components/Bloqued.vue';
import Axios from '../services';

const store = useStore();
const User = store.getters.getuser;
const refr = ref(0)

function test() {
  refr.value++
}

</script>

<template>
  <div class="hello">
    <h1>Welcome to our Pong</h1>
    <div class="table">
      <h3>Friend</h3>
      <h3>User</h3>
      <h3>Bloqued</h3>
      <Friend />
      <Users @refresh="test" :counter="refr" />
      <BloquedComp />
    </div>
    <div class="botton">
      <p>
        To play, please click on the button just below.
      </p>

      <router-link to="/matchmaking" class="button">
        <button class="play"> Let's play </button>
      </router-link>
      <p>Your ID is {{ User.id }}</p>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1 {
  padding: 1rem;
}

.botton {

  button {
    font-size: 30px;
    background-color: #4395c5;
    color: #1a4258;
    border: 1px solid #1a4258;
    border-radius: 8px;
    text-align: center;
    padding: 15px 32px;
    transition: 0.1s ease-in-out;

    &:hover {
      border: 3px solid #2d4b5c;
      background-color: #5b9abe;
    }
  }

  p {
    list-style-type: none;
    padding: 0.5rem;
    margin: 0;
  }
}
p {
  list-style-type: none;
  padding: 0.5rem;
  margin: 0;
}
}

.table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 20rem;

  div {
    padding-left: 0rem;
    padding-right: 0rem;
    border: black;
    border-radius: 15px;
  }
}
</style>
