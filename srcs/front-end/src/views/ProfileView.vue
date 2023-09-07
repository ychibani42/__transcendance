<template>
	<div class="profile">
		<label for="fileField"><img src="../assets/logo.png" class="img_class"></label>
		<h1>{{ name }}</h1>
		<form enctype="multipart/form-data" novalidate>
		<input type="file" id="fileField" name="file" accept="image/*" style="display:none">
		</form>
		<p>Edit Name: <input type="text" class="edit_name_class" @change="editName"></p>
		<User />
		<!-- <button @click="btn2FA">BTN 2FA</button> -->
	</div>
</template>
  
<script lang="ts" setup>

import { ref, OnBeforeMount } from 'vue'

					/* Variables */

const currentImageIndex = ref(0)
const name = ref('Name')

					/*Before Mount */



					/* function */

function uploadImage() {
	

}


</script>

<style lang="scss" scoped>

#filefield { display: none; }

</style>