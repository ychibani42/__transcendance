<template>
	<div class="profile">
		<label for="fileField">
			<img :src="picture" class="img_class">
		</label>
		<h1>{{ name }}</h1>
		<input type="file" id="fileField" ref="selectedFile" name="file" accept="image/*" style="display:none" @change="uploadImage($event)">
		<p>Edit Name: <input type="text" class="edit_name_class" @change="editName"></p>
		<div class="btn"> 2FA
			<button class="false" @click="Button2fa" v-if="btn == false">FALSE</button>
			<button class="true" @click="Button2fa" v-else>TRUE</button>
		</div>
	</div>
</template>
  
<script lang="ts" setup>

import { ref, onMounted, onUpdated } from 'vue'
import Axios from '../services'
import { useStore } from 'vuex';

					/* Variables */
const store = useStore()
const User = ref()
const selectedFile = ref('')
const name = ref('Name')
const btn = ref(false)
const picture = ref()
					/*Before Mount */
const con = ref(0)


async function getPictureBeforeMount() {
 console.log(con.value)
  await Axios.get('auth/Me').then(res => {
      if(res.status == 200)
        con.value = res.data.id
  })
  console.log(con.value)
  await Axios.get('users/picture/' + con.value, {
	 responseType: 'blob'
  }).then(res => {

	console.log(res.data);
	
	let reader = new FileReader();
	reader.readAsDataURL(res.data);
	reader.onload = () => {
		picture.value = reader.result
	}
  });
}

onMounted(() => {
	btn.value = store.state.user.Twofa
	getPictureBeforeMount()
})
					/* function */

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

const uploadImage = async (event) => {
	selectedFile.value = event.target.files[0];
	const formData = new FormData();
      formData.append("file", selectedFile.value);
	try {
		const response = await Axios.post("users/upload/" + 1, formData, {
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