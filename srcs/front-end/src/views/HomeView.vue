<script lang="ts" setup>
import { ref} from "vue";
import Friend from '../components/Friend.vue';
import Users from '../components/User.vue';
import BloquedComp from '../components/Bloqued.vue';

const friend = ref()
const user = ref()
const blocked = ref()

function refresh() {
  friend.value.refresh()
  user.value.refresh()
  blocked.value.refresh()
}

</script>

<template>
  <div class="hello">
    <h1>Welcome to our Pong</h1>
    <div class="botton">
      <router-link to="/matchmaking" class="button">
        <button class="play"> Let's play </button>
      </router-link>
      <!-- <p>Your ID is {{ User.id }}</p> -->
    </div>
    <div class="table">
      <h3>Friend</h3>
      <h3>User</h3>
      <h3>Bloqued</h3>
      <Friend ref="friend" @refrr="refresh"/>
      <Users ref="user" @refrr="refresh"/>
      <BloquedComp ref="blocked" @refrr="refresh"/>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

// h1{
//   padding: 1rem;
//   color: yellowgreen;
//   font-size: 3rem;
//   font-style:italic;
//   font-family:Verdana, Geneva, Tahoma, sans-serif;
// }

.botton {
  margin: 3rem;
  button {
    background-color: #bfc7cb;
    color: #141d22;
    border: 1px solid #1a4258;
    border-radius: 8px;
    text-align: center;
    padding: 15px 32px;
    transition: 0.1s ease-in-out;

    &:hover {
      border: 2px solid #131719;
      background-color: #4ade80;;
    }
  }

  p {
    list-style-type: none;
    padding: 3rem;
    margin: 0;
  }
}
p {
  list-style-type: none;
  padding: 0.5rem;
  margin: 0;
}

.table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 20rem;
  margin-top: 3rem;

  div {
    padding-left: 0rem;
    padding-right: 0rem;
    border: black;
    border-radius: 15px;
  }
}

</style>
