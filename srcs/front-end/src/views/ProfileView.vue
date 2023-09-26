<template>
	<div class="profile">
		<div class="picture">
		<Picture/>	
		</div>
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
import Picture from '../components/Picture.vue';

					/* Variables */
const store = useStore()
const User = ref()
const selectedFile = ref('')
const name = ref('Name')
const btn = ref(false)
const picture = ref()
					/*Before Mount */
const con = ref(0)



onMounted(() => {
	btn.value = store.state.user.Twofa
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
