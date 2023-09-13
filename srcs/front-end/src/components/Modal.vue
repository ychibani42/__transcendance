<template>
    <div class="modal-backdrop">
      <div class="modal">
        <h2 class="modal-header">
            <slot name="header"> {{ header }}</slot>
        </h2>
        <div class="modal-body">
            <form @submit.prevent="status" class="content">
                <div v-for="users in chandisp.user" > 
                  <input type="checkbox" :value="users.id" v-model="checked"> {{ users.id }}    
                </div>
                <span>{{ checked }}</span>
                    
                    <button type="submit" @ban="banned === true" @mute="muted === true" @admin="admin === true">
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
import { useStore, mapState } from 'vuex'
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

function status() {
      let userid: number = checked.value
      let chanid: number = chandisp.idch
      socket.emit(props.emit, { userid, chanid })
}


</script>

<style lang="scss" scoped>

  .modal-backdrop {
    position: fixed;
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