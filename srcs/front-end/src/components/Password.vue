<template>
  <div class="modal-backdrop">
      <div class="modal">
            <h2>Password</h2>
            <form @submit.prevent="status" class="content">
               <input type="password" v-model="password">
            </form>
            <button>Submit</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { ref } from 'vue';

const password = ref('')
const store = useStore()
const socket = store.getters.getChansocket;

function status() {
      let pass: number = password.value
      let userid: number = store.state.user.id
      let chanid: number = store.state.chandisp.idch
      socket.emit('password', { pass, userid, chanid })
}
</script>

<style lang="scss" scoped>

.modal-backdrop {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
.modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  }
</style>