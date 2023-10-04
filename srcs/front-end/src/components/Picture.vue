<template>
    <div class="picture">  
        <label for="fileField">        
          <img :src="picture" class="img_class">
        </label>
        <input type="file" id="fileField" ref="selectedFile" name="file" accept="image/*" style="display:none"
            @change="uploadImage($event)">
    </div>
</template>
  
<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Axios from '../services';

const User = useStore().getters.getuser;
const selectedFile = ref('');
const picture = ref('');
const con = ref(0);

const getPictureBeforeMount = async () => {
  try {
    const res = await Axios.get('auth/Me');
    if (res.status === 200) {
      con.value = res.data.id;
      getPicture();
    }
  } catch (error) {
    console.error(error);
  }
};

const getPicture = async () => {
  try {
    const res = await Axios.get(`users/picture/${User.id}`, {
      responseType: 'blob',
    });
    const blob = res.data;
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      picture.value = reader.result;
    };
  } catch (error) {
    console.error(error);
  }
};

const uploadImage = async (event) => {
  selectedFile.value = event.target.files[0];
  const formData = new FormData();
  formData.append('file', selectedFile.value);
  try {
    console.log(User.id);
    await Axios.post(`users/upload/`+ User.id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('File uploaded successfully');
    getPicture();
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getPictureBeforeMount();
});

</script>


<style lang="scss" scoped>

.picture {
  margin-top: 2rem;
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #111;
  cursor: pointer; /* Add cursor pointer for better UX */
}

.picture:hover .img_class {
  opacity: 0.5;
}

.img_class {
  object-fit: cover;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
  width: 100%;
  height: 100%;
}

</style>
  