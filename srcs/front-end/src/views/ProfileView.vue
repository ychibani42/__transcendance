<template>
	<div class="profile">
		<label for="fileField"><img src="../assets/logo.png" class="img_class"></label>
		<h1>{{ name }}</h1>
		<form @submit.prevent="uploadImage" className="" ref="selectedFile">
		<input type="file" id="fileField" name="file" accept="image/*" style="display:none" @change="handleFile($event)">
		<button type="submit" className="button_picture">change Avatar</button>
		</form>
		<p>Edit Name: <input type="text" class="edit_name_class" @change="editName"></p>
		<div class="btn">
			<button class="false" @click="Button2fa" v-if="btn == false">BTN 2FA FALSE</button>
			<button class="true" @click="Button2fa" v-else>BTN2 TRUE</button>
		</div>
	</div>
</template>
  
<script lang="ts" setup>

import { ref, onBeforeMount } from 'vue'
import Axios from '../services'
import { useStore } from 'vuex';

					/* Variables */
const store = useStore()
const User = ref()
const selectedFile = ref('')
const name = ref('Name')
const btn = ref(false)

					/*Before Mount */

onBeforeMount(() => {
	Axios.get("/users" + User.value.id)
}),


					/* function */
function handleFile( event ) {
	selectedFile.value = event.target.files[0];
}

async function Button2fa(){
	User.value = store.getters.getuser
	console.log(User.value.id)
	await Axios.post("auth/Button2FA",{id : User.value.id}).then(response => {
		if(response){
			if(response.data == true)
				btn.value = true 
			else
				btn.value = false 
		}
	})
	btn.value = !btn.value
}

const uploadImage = async () => {

	const formData = new FormData();
	console.log(selectedFile.value);
      formData.append("file", selectedFile.value);
	try {
		console.log(formData);
		const response = await Axios.post("users/upload", formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			}
		});
	} catch (error) {
		console.log(error);
	}
}


</script>

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

.btn{
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