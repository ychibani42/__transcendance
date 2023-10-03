
  
<script lang="ts" setup>

import { ref, onMounted} from 'vue'
import Axios from '../services'
import { useStore } from 'vuex';
import Picture from '../components/Picture.vue';
import History from '../components/History.vue';
import { toast } from 'vue3-toastify'
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


async function editName(event) {
	User.value = store.getters.getuser
	await Axios.post("users/Change", {id : User.value.id, name: event.target.value}).then(response => {
<<<<<<< HEAD
		if (response) {
=======
		if (response.status == 201) {
>>>>>>> 1e152ce3d4bc75db1caaa2da0c1db565557bfada
			name.value = response.data
		}
		else
		{
			 toast("Name too large", { autoClose: true}) 
		}
	})
}

async function Button2fa() {
	User.value = store.getters.getuser
	await Axios.post("auth/Button2FA", {id : User.value.id}).then(response => {
		if (response){
			if (response.data == true)
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
		<div class="name"> <h2>{{ name }}</h2></div>
		<div class="components">
			<div class="edit">
				<h5>Edit Name:</h5>
					<input type="text" class="edit_name_class" @change="editName($event)">
				
			</div>
			<div class="btn"> 
				<h5>Auth 2FA: </h5>
				<button class="false" @click="Button2fa" v-if="btn == false">FALSE</button>
				<button class="true" @click="Button2fa" v-else>TRUE</button>
			</div>
		</div>
			
		<History/>
	</div>
</template>

<style lang="scss" scoped>
  
.profile {
	display: flex;
    flex-direction: column;
    align-content:flex-start;
    flex-wrap: nowrap;
    align-items: center;
	
	}
  h1{
    padding:5px;
  }
  input[type="text"] {
      width:200px;
	  margin-top: 0.4rem;
      height:25px;
      border-radius:3px;
      background-color: rgb(237, 239, 239);
      margin-left:2px;
	 
  }
 .edit {
		display: flex;
		flex-direction: row;
		h5 {
			margin-top: 1rem;
		}
}
.edit_name_class{
	display: flex;
}

.btn {
	display: flex;
	flex-direction: row;
	.false{
    	color: #f8f9f9;
    	border: 1px solid #1a4258;
    	border-radius: 30px;
		text-align: center;
		// padding: 0 0;
		font-size: 0.7rem;
		transition: 0.1s ease-in-out;
    	background-color: #d91b1b;
	}
	.true{
		color: #e8edef;
    	border: 1px solid #1a4258;
    	border-radius: 30px;
		text-align: center;
		// padding: 7px 20px;
		font-size: 0.7rem;
		transition: 0.1s ease-in-out;
    	background-color: #4ade80;
	}
}
</style>
