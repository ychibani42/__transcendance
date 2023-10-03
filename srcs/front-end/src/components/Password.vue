<template>
  <div class="modal-backdrop">
      <div class="modal">
            <h2>Password</h2>
            <form @submit.prevent="status" class="content">
               <input type="password" v-model="password">
               <button type="submit">Submit</button>
               <button @click="emit('close')">Cancel</button>
            </form>
            
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { ref } from 'vue';

const password = ref('')
const store = useStore()
const socket = store.getters.getChansocket;
const emit = defineEmits(['enter', 'unlock', 'close'])

function status() {
      let pass: number = password.value
      let userid: number = store.state.user.id
      let chanid: number = store.state.chandisp.idch
      let oldChatId: number = store.state.chandisp.oldChatId
      socket.emit('password', { pass: pass, userId: userid, chatId: chanid, oldChatId: oldChatId }, response => {
        emit('unlock')
        emit('enter')
        emit('close')
      })
      
}
</script>

<style lang="scss" scoped>

.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 10px;
  input {
    margin: 5px;
  }
}
.modal-backdrop {
    position: fixed;
    z-index: 3;
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
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    h2 {
      display: flex;
      justify-content: center;
    }
  }
</style>