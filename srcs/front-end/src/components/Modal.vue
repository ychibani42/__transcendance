<template>
    <div class="modal-backdrop">
      <div class="modal">
        <h2 class="modal-header">
            <slot name="header"> {{ header }}</slot>
        </h2>
        <div class="modal-body">
            <form @submit.prevent="status" class="content">
                  <div class="list-user" v-for="users in chandisp.user" > 
                    <div class="checkbox" v-if="User.id != users.id && users.id != chandisp.ownerId && ((stat === 'admin' && !isAdmin(users.id)) || (stat === 'banned' && !isBanned(users.id)) || (stat === 'muted' && !isMuted(users.id)) || (stat === 'kicked')) ">
                      <div class="checking"> <input type="checkbox" :value="users.id" v-model="checked"> </div>
                      <div class="name">{{ users.name }}</div>
                      
                      
                    </div>
                   
                </div>

                <div v-if="stat == 'unadmin'" > 
                  <div class="list-user" v-for="users in chandisp.admin" >
                    <div class="checkbox" v-if="User.id != users.user.id && users.user.id != chandisp.ownerId ">
                      <div class="checking"><input type="checkbox" :value="users.user.id" v-model="checked">  </div> 
                     
                      <div class="name">{{ users.user.name }}</div>
                      
                    </div>
                     
                  </div>
                </div>

                <div v-if="stat == 'unbanned'" >
                  <div class="list-user" v-for="users in chandisp.banned" > 
                    <div class="checkbox" v-if="User.id != users.user.id">
                      <div class="checking"><input type="checkbox" :value="users.user.id" v-model="checked"> </div>
                      <div class="name">{{ users.user.name }}</div>
                    </div>
                  </div>
                </div>

                 <div v-if="stat == 'muted'"> 
                    Time:
                      <select name="time" id="time">
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="30">30</option>
                      </select>
                   </div>
                   <div class="buttons"> 
                      <button type="submit" @ban="banned === true" @mute="muted === true" @admin="admin === true" @kick="kicked === true" @unadmin="unadmin === true">
                          Submit
                      </button>
                    

                      <button type="button" class="cancel" @click="emit('close')">
                          Cancel
                      </button>

                   </div>
                   
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { ref } from 'vue';

const props = defineProps({'emit': String, 'header': String})

const emit = defineEmits(['close'])
const store = useStore()
const chandisp = store.getters.getChandisp;
const checked = ref([])
const socket = store.getters.getChansocket;
const banned = ref(false)
const muted = ref(false)
const admin = ref(false)
const User = store.getters.getuser;
const stat = ref(props.emit)
const time = ref(0)

function status() {
      let userid: number = checked.value
      let chanid: number = chandisp.idch
      let duration: number = 0
      if (props.emit == 'muted')
        duration = document.querySelector('#time').value
      socket.emit(props.emit, { chatId: chanid, userId: userid, duration: duration }, response => {
        emit('close')
      })

}

function isAdmin(userid: number) {
    for (let i = 0; i < chandisp.admin.length; i++)
    {
        if (chandisp.admin[i].user.id == userid)
        {
          return true
        }
            
    }
    return false
    
}

function isBanned(userid: number) {
    for (let i = 0; i < chandisp.banned.length; i++)
    {
        if (chandisp.banned[i].user.id == userid)
        {
          return true
        }
            
    }
    return false
    
}
function isMuted(userid: number) {
    for (let i = 0; i < chandisp.muted.length; i++)
    {
        if (chandisp.muted[i].user.id == userid)
        {
          return true
        }
            
    }
    return false
    
}


</script>

<style lang="scss" scoped>

  .modal-backdrop {
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
   
  }
.modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;

  }
  button {
    margin-top: 10px;
  }
  .list-user {
    display: flex;
    justify-content: flex-start;
    margin-left: 20%;
    padding-right: 10px;
    color:  rgba(0, 0, 0, 0.3);
  }

  .modal-body {
    form {
       .list-user {
        .checkbox {
          display: flex;
          flex-direction: row;
          .name {
            font-size: 0.7rem;
            margin-top: 4px;
            margin-left: 4px;
            
          }
         
        }
       
     }
    }
    .buttons {
      button{
            background-color: #ffffff;
            color: #141d22;
            border-radius: 8px;
            text-align: center;
            padding: 10px 25px;
            transition: 0.1s ease-in-out;

            &:hover {
            border: 2px solid #131719;
            background-color: #4ade80;;
            }
      }
      
    }
   
  }
 
</style>