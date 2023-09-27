
  
<script lang="ts" setup>

import { ref, onMounted} from 'vue'
import Axios from '../services'
import { useStore } from 'vuex';
import Picture from '../components/Picture.vue';
import History from '../components/History.vue';

					/* Variables */
const store = useStore()
const User = ref()
const name = ref()
const btn = ref(false)
					/*Before Mount */



onMounted(() => {
	btn.value = store.state.user.Twofa
	name.value = store.state.user.username
})
					/* function */


async function editName(event){
	User.value = store.getters.getuser
	console.log(event.target.value)
	await Axios.post("users/Change", {id : User.value.id, name: event.target.value}).then(response => {
		if (response) {
			console.log(response.data)
			name.value = response.data
		}
	})
}


async function Button2fa(){
	User.value = store.getters.getuser
	await Axios.post("auth/Button2FA", {id : User.value.id}).then(response => {
		if(response){
			if(response.data == true)
				btn.value = true 
			else
				btn.value = false 
		}
	})
	btn.value = !btn.value
}

</script>

<template>
	<div class="profile">
		<Picture/>	
		{{ name }}
		<p>Edit Name: <input type="text" class="edit_name_class" @change="editName($event)"></p>
		<div class="btn"> 2FA
			<button class="false" @click="Button2fa" v-if="btn == false">FALSE</button>
			<button class="true" @click="Button2fa" v-else>TRUE</button>
		</div>
		<History/>
	</div>
</template>

<style lang="scss" scoped>
  
.profile{
    display: flex;
    flex-direction: column;
    align-content: center;
    flex-wrap: nowrap;
    align-items: center;
	}
  h1{
    padding:5px;
  }
  input[type="text"] {
      width:200px;
      height:30px;
      border-radius:5px;
      background-color: lightblue;
      margin-left:2px;
  }

.edit_name_class{
	display: flex;
}

.btn {
	.false{
		background-color: red;
		color: gold;
	}
	.true{
		background-color: green;
		color: gold;
	}
}



</style>
