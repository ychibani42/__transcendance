<template>
	<div class="profile">
		<img src="../assets/logo.png" class="img_class">
		<h1>{{ name }}</h1>
		<p>Edit Avatar: <input type="file" class="avatar_class" @change="editImage"> </p>
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
function changeImage() {
	// .img_class {

	// }

	// .edit_name_class + .avatar_class
}


</script>

<style lang="scss" scoped>


</style>