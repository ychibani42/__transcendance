<template>
    <div>
      <label for="fileField">
        <img :src="picture" class="img_class">
      </label>
      <input
        type="file"
        id="fileField"
        ref="selectedFile"
        name="file"
        accept="image/*"
        style="display:none"
        @change="uploadImage"
      >
    </div>
  </template>
  
  <script lang="ts">

  import { ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import Axios from '../services';
  
  export default {
    setup() {
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
        // SI L'ID EST CELUI EST LE  MIEN JE PEUX APPELER CETTE FONCTION
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
  
      return { picture, uploadImage, getPicture };
    },
    defineExpose: ['getPicture'],
  };
  </script>
  
  <style scoped>
  .img_class {
    width: 400px;
    height: 400px;
    border-radius: 50%;
  }
  </style>
  