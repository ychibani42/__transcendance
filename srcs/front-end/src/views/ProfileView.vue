<template>
	<div class="profile">
		<label for="fileField"><img src="../assets/logo.png" class="img_class"></label>
		<h1>{{ name }}</h1>
		<form @submit.prevent="uploadImage" className="" ref="selectedFile">
		<input type="file" id="fileField" name="file" accept="image/*" style="display:none" @change="handleFile($event)">
		<button type="submit" className="button_picture">change Avatar</button>
		</form>
		<p>Edit Name: <input type="text" class="edit_name_class" @change="editName"></p>
		<!-- <button @click="btn2FA">BTN 2FA</button> -->
	</div>
</template>
  
<script lang="ts" setup>

import { ref, OnBeforeMount } from 'vue'
import Axios from '../services'

					/* Variables */

const selectedFile = ref('')
const name = ref('Name')

					/*Before Mount */



					/* function */
function handleFile( event ) {
	selectedFile.value = event.target.files[0];
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

</style>