<template>
    <div class="admin">
        <h2>Admin</h2>
        <form @submit.prevent="funct" class="content">
            <div v-for="users in chandisp.user" > 
                <input type="checkbox" :value="users.id" v-model="checked"> {{ users.id }}    
            </div>
            <span>{{ checked }}</span>
            <div class="routers">
                <div class="router">
                    
                    <button type="submit">
                        Submit
                    </button>
                </div>
                <div class="router">
                    <router-link to="/chat" class="button">
                        Cancel
                    </router-link>
                </div>
            </div>
        </form>
</div>
</template>
        


<script lang="ts" setup>
import { useStore, mapState } from 'vuex'
import { onBeforeMount, ref, reactive, computed, Vue } from 'vue';
const store = useStore()
const chandisp = store.getters.getChandisp;
const checked = ref([])

function funct() {
     console.log(checked.value) 
     console.log(chandisp.user) 
}


</script>

<style lang="scss" scoped>
.content {
    background-color: beige;
    border-radius: 10px;
    width: 70%; 
    height: 500px;
    .routers {
        display: flex;
        justify-content: center;
    }
}
.admin {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

}
.router {
    display: flex;
    justify-content: center;
    margin: 5px;
    .button {
        color: black;
    }
    background-color: rgb(238, 241, 238);
    padding: 10px;
    border-radius: 10px;
}
</style>