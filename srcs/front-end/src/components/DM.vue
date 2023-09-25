<script setup lang="ts">
import { useStore } from 'vuex';
import { ref , onMounted,onBeforeMount } from 'vue';
import Axios from '../services';

const store = useStore()
const props = defineProps({'emit': String, 'header': String})
const event = ref(props.emit)
const chandisp = store.getters.getChandisp
const ID = ref()
const friend = ref([])
const socket = store.getters.getChansocket;
const User = store.getters.getuser;
const messageText = ref('');
const emit = defineEmits(['open'])
const DM = ref({
	messages : [],
	id : 0,
    user1: {},
    blocked: false,

})

async function getFriend(){
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        ID.value = res.data.id
      
  })
  Axios.post('friend',{id : ID.value}).then((res) => {
        friend.value = res.data
  })
}

onMounted(() => {
  getFriend()
});

function enterdm() {
    emit('open')
}


</script>

<template>
    <div class="friend">
      <ul v-for="friends in friend">
        <li> 
          <div class="Userdisp">
            <button @click="enterdm()"> {{ friends.user.name }}</button>  
          </div>
        </li>
      </ul>
    </div>
    <div class="typing-messages" v-if="event == 'type-messages'">
        <form @submit.prevent="createMessage">
            <input class="text" type="text" placeholder="type your message" v-model="messageText" required>
            <button><span class="material-icons">send</span></button>   
        </form> 
    </div>
    <div v-if="event == 'messages'">
        <ol v-for="name in DM.messages" v-if="onChan === true">
            <div class="message" v-if="name.user1.id === User.id" >
                <p>
                    {{ name.text }} {{ User.name }}
                </p>  
            </div>
            <div class="Autre" v-else>
                <p>
                    {{ name.text }} {{ name.user1.name }}
                 </p>
            </div>
		</ol>
    </div>
</template>

<style lang="scss" scoped>

.friend {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  ul {
    padding: 0;
    width: 100%;
    list-style: none;
    gap: 0.5%;
    button {
        width: 100%;
    }
  }
}

.Userdisp {
    display: flex;
    flex-direction: row;
    padding: 0;
    height: 2.5rem;
   
}

.typing-messages {
    form {
        display: flex;
        width: 100%;
    }
    input {
        width: 100%;
        border: 8px solid transparent;
    }
    button {
        border-radius: 1px;
        background-color: rgb(149, 195, 247);
        border: 1px solid transparent;
        span {
            margin-top: 2px;
            margin-left: 2px;
        }
    }
}

</style>