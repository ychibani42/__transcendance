<template>
    <div class="admin">
        <h2>Admin</h2>
        <div class="content">
            <div  v-for="users in chandisp.user" > 
                <input type="checkbox" id="checked">
                {{ users.id }}
                
                
            </div>
            <div class="routers">
                <div class="router">
                    
                    <router-link to="/chat" class="button">
                        Submit
                    </router-link>
                </div>
                <div class="router">
                    <router-link to="/chat" class="button">
                        Cancel
                    </router-link>
                </div>
            </div>
    </div>
</div>
</template>
        


<script lang="ts" setup>
import { useStore, mapState } from 'vuex'
import { onBeforeMount, ref, reactive, computed, Vue } from 'vue';
const store = useStore()
const chandisp = store.getters.getChandisp;
const test = ref({
    checked: ''
})

function funct() {
     console.log(test.checked)   
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