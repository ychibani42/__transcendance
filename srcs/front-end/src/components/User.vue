<script setup lang="ts">
import { useStore } from 'vuex';
import { ref , onMounted ,onBeforeMount,onUpdated ,onBeforeUpdate} from 'vue';
import Axios from '../services';

const store = useStore()
const ID  = ref();
const User = ref([])
const clicking = ref(false)
const click = ref(0)
const option = ref()

async function GetUser() {
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        ID.value = res.data.id
  })
  Axios.post('users',{id : ID.value}).then((res) => {
        User.value = res.data
  })
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

function cancel(){

  console.log("HERE",option.value)
  clicking.value = false
  click.value = 0
  option.value = ""
}


onMounted(() => {
  GetUser()
});

</script>

<template>
    <div class="User">
      <ul v-for="Users in User">
        <li>
          <div class="Userdisp">
            <button @click="clicked(Users.id)"> {{ Users.name }}</button>
              
          </div>
        </li>
        <div class="modal" v-if="clicking == true && Users.id == click">
            <button v-on:click="say('hi')" >Profile</button>
            <button v-on:click="say('what')">Add friend</button>
            <button v-on:click="say('what')">Bloque</button>
            <button v-on:click="cancel">Cancel</button>
        </div>
      </ul>
    </div>
</template>

<style scoped>

.modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;

    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  }

.User {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  height: 15rem;
}

.Userdisp{
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
}

ul{
  list-style: none;
}
</style>