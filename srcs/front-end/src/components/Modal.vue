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
                      <input type="checkbox" :value="users.id" v-model="checked"> 
                      {{ users.name }}
                      
                    </div>
                   
                </div>

                <div v-if="stat == 'unadmin'" > 
                  <div class="list-user" v-for="users in chandisp.admin" > 
                    <div class="checkbox" v-if="User.id != users.id && users.id != chandisp.ownerId ">
                      <input type="checkbox" :value="users.id" v-model="checked"> 
                      {{ users.user.name }}
                      
                    </div>
                     
                  </div>
                </div>

                <div v-if="stat == 'unbanned'" >
                  <div class="list-user" v-for="users in chandisp.banned" > 
                    <div class="checkbox" v-if="User.id != users.id">
                      <input type="checkbox" :value="users.id" v-model="checked"> 
                      {{ users.user.name }}
                    </div>
                  </div>
                </div>

                <div v-if="stat == 'unmuted'" >
                  <div class="list-user" v-for="users in chandisp.muted" > 
                    <div class="checkbox" v-if="User.id != users.id">
                      <input type="checkbox" :value="users.id" v-model="checked"> 
                      {{ users.user.name }}
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
                    <button type="submit" @ban="banned === true" @mute="muted === true" @admin="admin === true" @kick="kicked === true" @unadmin="unadmin === true">
                        Submit
                    </button>
                   

                    <button type="button" class="cancel" @click="emit('close')">
                        Cancel
                    </button>

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
      let duration: number = document.querySelector('#time').value
      socket.emit(props.emit, { userid, chanid, duration }, response => {
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
  }
 
</style>