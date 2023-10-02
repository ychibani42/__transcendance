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
    const res = await Axios.get(`users/picture/${con.value}`, {
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
    await Axios.post(`users/upload/${User.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
    display: flex;
}

.img_class {
    margin: 5rem;
    width: 200px;
    height: 200px;
    border-radius: 50%;
}
</style>
  