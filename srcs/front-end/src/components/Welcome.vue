
<template>
  <div class="hello">
    <h1>Welcome to our Pong</h1>
    <p>
     To play, please click on the button just below.
    </p>
    <p>You will be redirected in a matchmaking room.</p>
    <button class="play">
       Play
    </button>
  </div>
</template>

<script lang="ts" setup>

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  margin: 100px 0 0;
  font-size: 60px;
  background-color: #4395c5;
  color: #1a4258;
	border: 1px solid #1a4258;
	border-radius: 8px;
  text-align: center;
  padding: 15px 32px;
}
p {
  list-style-type: none;
  padding: 0.5rem;
}
h1 {
  padding: 2rem 0rem 5rem;
}

</style>
