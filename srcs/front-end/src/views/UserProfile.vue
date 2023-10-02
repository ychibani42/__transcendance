
<template>
    <div class="profile">
        <label for="fileField">
            <img :src="picture" class="img_class">
        </label>
        {{ name }}
        <h1> GameHistory</h1>
        <div v-if="games.length == 0">
            <span> No game played </span>
        </div>
        <div v-else>
            <div v-for="name in games">
                <span v-if="name.score[0] == 5"> Winner {{ name.user1.name }} | {{ name.score[0] }} : {{ name.score[1] }} |
                    {{
                        name.user2.name }} Looser </span>
                <span v-else> Looser {{ name.user1.name }} | {{ name.score[0] }} : {{ name.score[1] }} | {{ name.user2.name
                }}
                    Winner</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Axios from '../services';
import { useRoute } from 'vue-router';
import History from '../components/History.vue';
import router from '../router';


const routes = useRoute()
const name = ref()
const picture = ref()
const con = ref(0);
const id = ref(useRoute().params.id);
const games = ref([])


onMounted(() => {
    fetchUser(routes.params.id);
    getPictureBeforeMount();
})

async function GetGames(usersname: string) {
    await Axios.post('game/Findbyname', {
        name: usersname
    })
        .then(res => {
            console.log(res.data);
            games.value = res.data
        })
}

async function fetchUser(id: number) {
    await Axios.get('users/fetch/' + id).then((res) => {
        name.value = res.data.name;
        console.log(res.data)
        if (res.status === 200) {
            name.value = res.data.name;
        }
        else {
            router.push('/Home')
        }
    }).then(() => {
        GetGames(name.value)
    })
}

const getPictureBeforeMount = async () => {
    try {
        const res = await Axios.get('auth/Me');
        if (res.status === 200) {
            con.value = routes.params.id;
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

</script>

<style lang="scss" scoped>
.profile {
    display: flex;
    flex-direction: column;
    align-content: center;
    flex-wrap: nowrap;
    align-items: center;
}

.img_class {
    width: 400px;
    height: 400px;
    border-radius: 50%;
}

h1 {
    padding: 5px;
}
</style>