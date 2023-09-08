<template>
	<div class="profile">
		<label for="fileField"><img src="../assets/logo.png" class="img_class"></label>
		<h1>{{ name }}</h1>
		<form @submit.prevent="uploadImage">
		<input type="file" id="fileField" name="file" accept="image/*" style="display:none" @change="uploadImage">
		</form>
		<p>Edit Name: <input type="text" class="edit_name_class" @change="editName"></p>
		<User />
		<!-- <button @click="btn2FA">BTN 2FA</button> -->
	</div>
</template>
  
<script lang="ts" setup>

import { ref, OnBeforeMount } from 'vue'
import Axios from '../services'

					/* Variables */

const selectedFile = ref('')
const currentImageIndex = ref(0)
const name = ref('Name')

					/*Before Mount */



					/* function */

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

#filefield { display: none; }

</style>