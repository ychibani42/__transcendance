
<template>
    <div class="profile">
      <label for="fileField">
        <img :src="picture" class="img_class">
      </label>
      {{ name }}
      <History/>
    </div>

</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Axios from '../services';
import { useRoute } from 'vue-router';
import History from '../components/History.vue';


const routes = useRoute()
const store = useStore()
const name = ref()
const picture = ref()
const con = ref(0);
const id = ref(useRoute().params.id);


onMounted(() => {
    name.value = store.state.user.username;
    fetchUser(routes.params.id);
    getPictureBeforeMount();
})

async function fetchUser(id: Number) {
    await Axios.post('users', { id: id }).then((res) => {
        console.log(res.data)
    })
}

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
        const res = await Axios.get(`users/picture/${id.value}`, {
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

</script>

<style lang="scss" scoped>
.profile {
	display: flex;
    flex-direction: column;
    align-content: center;
    flex-wrap: nowrap;
    align-items: center;
}

h1 {
	padding:5px;
}
</style>