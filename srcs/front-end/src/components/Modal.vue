<template>
    <div class="modal-backdrop">
      <div class="modal">
        <h2 class="modal-header">
            <slot name="header"></slot>
        </h2>
        <div class="modal-body">
            <form @submit.prevent="funct" class="content">
                <div v-for="users in chandisp.user" > 
                  <input type="checkbox" :value="users.id" v-model="checked"> {{ users.id }}    
                </div>
                <span>{{ checked }}</span>
                    
                    <button type="submit">
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
import { onBeforeMount, ref, reactive, computed, Vue, defineEmits } from 'vue';
const emit = defineEmits(['close'])
const store = useStore()
const chandisp = store.getters.getChandisp;
const checked = ref([])

function funct() {
     console.log(checked.value) 
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
  }
</style>