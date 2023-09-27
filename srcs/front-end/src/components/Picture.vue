<template>
    <div>
        <label for="fileField">
            <img :src="picture" class="img_class">
        </label>
        <input type="file" id="fileField" ref="selectedFile" name="file" accept="image/*" style="display:none"
            @change="uploadImage($event)">
    </div>
</template>


<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useStore } from 'vuex';
import Axios from '../services';

                    /* Variables */


const User = useStore().getters.getuser
const selectedFile = ref('')
const picture = ref()


					/*Before Mount */
const con = ref(0)

async function getPictureBeforeMount() {
     await Axios.get('auth/Me').then(res => {
         if(res.status == 200)
           con.value = res.data.id
     })
     getPicture();
   }
   
   onMounted(() => {
       getPictureBeforeMount()
   })

export async function getPicture() {
    await Axios.get('users/picture/' + con.value, {
       responseType: 'blob'
    }).then(res => {
  
      let reader = new FileReader();
      reader.readAsDataURL(res.data);
      reader.onload = () => {
          picture.value = reader.result
      }
    });
  }
  
  const uploadImage = async (event:any) => {
      selectedFile.value = event.target.files[0];
      const formData = new FormData();
        formData.append("file", selectedFile.value);
      try {
          const response = await Axios.post("users/upload/" + User.id, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              }
  
          });
          getPicture();
      } catch (error) {
          console.log(error);
      }
  }

export { picture }

</script>


<style lang="scss" scoped>

.img_class {
    width: 400px;
    height: 400px;
    border-radius: 50%;
}

</style>
