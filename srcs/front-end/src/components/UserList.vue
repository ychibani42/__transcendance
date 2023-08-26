<template>
    
   <!-- <input v-model="username" list="users"> -->
     <form id="add a friend">
        <select name="add a friend">
            <option value="">add a friend</option>
            <option v-for="username in users" :key="username.id">{{username.username}}</option>  
        </select>    
    </form>
</template>

<script lang="ts">
export default {
    name: 'UserList',
    data() {
        return {
            username: '',
            users: [
                {username:'eder', id:1},
                {username:'tea', id:2},
                {username: 'yassine', id:3},
            ]
        }
    }
}
</script>

<style scoped>
input::-webkit-calendar-picker-indicator {
              opacity: 100;
           }
input {
    width: 50px;
    height: 10px;
    background-color: var(--dark);
}
</style>