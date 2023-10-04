<script setup lang="ts">
import { useStore } from 'vuex';
import { ref , onMounted, onBeforeMount } from 'vue';
import Axios from '../services';

const emit = defineEmits(['refrr'])

const ID = ref()
const Bloqued = ref([])
const clicking = ref(false)
const click = ref(0)


const refresh = () => {
    getBloqued()
}
defineExpose({refresh})


async function getBloqued(){
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        ID.value = res.data.id
  })
  Axios.post('friend/blocklist',{id : ID.value}).then((res) => {
        Bloqued.value = res.data;
  })
}

onMounted(() => {
  getBloqued()
});

function cancel(){
  clicking.value = false
  click.value = 0
}

function clicked(nbr : number){
    
    if(click.value == nbr)
    {
      clicking.value = !clicking.value
      click.value = 0
    }
    else
    {
      clicking.value = true
      click.value = nbr
    }
}

function unblockFriend() {
  Axios.post('friend/unblock',{id: ID.value, blockid: click.value}).then((res) => {
    emit("refrr")
  })
}

</script>

<template>
    <div class="Bloqued">
      <ul v-for="Bloqueds in Bloqued">
        <li class="lis">
          <div class="User">
            <button class="Ubtn" @click="clicked(Bloqueds.user.id)"> {{ Bloqueds.user.name }}</button>  
          </div>
        </li>
        <div class="modal" v-if="clicking == true && Bloqueds.user.id == click">
          <button class="modal-btn" v-on:click="unblockFriend(Bloqueds.user.id)">unblock Friend</button>
          <button class="modal-btn" v-on:click="cancel">Cancel</button>
        </div>
      </ul>
    </div>
</template>

<style lang="scss" scoped>

ul {
  display: flex;
  justify-content: center;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
  .lis {
    width: 100%;
    display: flex;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    justify-content: center;
    button {
      background-color: #bfc7cb;
      color: #141d22;
      border: 1px solid #1a4258;
      border-radius: 8px;
      text-align: center;
      padding: 7px 22px;
      transition: 0.1s ease-in-out;

      &:hover {
        border: 2px solid #131719;
        background-color: #4ade80;;
      }
}
  }
}

  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    background-color: rgba(74, 72, 72, 0.7);
    display: flex;
    gap: 0.5rem;

    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  .modal-btn {
      background-color: #bfc7cb;
      color: #141d22;
      border: 1px solid #1a4258;
      border-radius: 8px;
      text-align: center;
      padding: 7px 22px;
      transition: 0.1s ease-in-out;

      &:hover {
        border: 2px solid #131719;
        background-color: #4ade80;;
      }
}}

.User{
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
  width: 100%;
  button{
    background-color: #bfc7cb;
      color: #141d22;
      border: 1px solid #1a4258;
      border-radius: 8px;
      text-align: center;
      padding: 7px 0;
      width: 100%;
      transition: 0.2s ease-in-out;

      &:hover {
        border: 2px solid #131719;
        background-color: #4ade80;;
      }
    }
  }

</style>