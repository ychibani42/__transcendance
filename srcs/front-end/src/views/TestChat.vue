<script lang="ts" setup>
import { io } from 'socket.io-client';
import { onBeforeMount, ref, reactive } from 'vue';

const socket = io('http://localhost:3000');
const addNewRoom = ref(false)
const chanId : number = ref(0)
const chan = ref([])
const chandisp = ref({
	messages : [],
	idch : 0,
	channame : '',
})
const createChan = ref({
	channelName: '',
	is_private: false,
	password: '',
	dm: false,
	ownerId: 1,
})

onBeforeMount(() => {
    displayChats()

});
function enterchat(chan : any){
	console.log(chan);
	chandisp.value.idch=chan.id
	chandisp.value.messages=chan.messages
	chandisp.value.channame=chan.channelName
	console.log(chandisp.value);
}

function findChat () {
	console.log(chanId)
	socket.emit('findOneChat', { id: chanId.value }, (response) => {
		console.log('name of the chat ')
		console.log(response);
	});
}
function displayChats () {
	console.log('ici')
	socket.emit('findAllChats', (response) => {
		chan.value = response
		console.log(response)
		return (response)
	});
}
function createChat () {
			socket.emit('createRoom', {
				channelName: createChan.value.channelName,
				is_private: createChan.value.is_private,
				password: createChan.value.password,
				dm: createChan.value.dm,
				ownerId: createChan.value.ownerId
			})
}
</script>

<template>
    <div class="chat-page">
        <div class="add-chat">
          <form v-if="addNewRoom" @submit.prevent="createChat">
                <input type="text" placeholder="Add username"  v-model="createChan.channelName" required>
                <button type="submit"> Create Room </button>
                <button class="button-cancel" @click="addNewRoom = false">Cancel</button>
            </form>
        </div>
        <div class="channel-list">
            <button @click="addNewRoom = true">+</button>
            <button @click="displayChats">refresh</button>
			<ul>
				<li v-for="name in chan">
					<button @click="enterchat(name)">{{ name.channelName }} </button>
				</li>
			</ul>
        </div>
        <div class="chat-display">
            <div class="chat-header">
                
            </div>
            <div class="chat-messages">
                        message
            </div>
            <div class="typing-messages">

            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.chat-page {
    height: 100%;
    display: flex;
    background-color: aliceblue;
}

.channel-list {
    display: flex;
    flex-flow: column;
    flex: 0 0 15%;
    min-width: 150px;
    max-width: 300px;
    position: relative;
    height: 100%;
    background-color: rgb(240, 240, 231);

}

.chat-display {
    position: relative;
    height: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    background-color:rgb(143, 143, 158);
}

.chat-header {
    position: absolute;
    display: flex;
    align-items: center;
    height: 64px;
    width: 100%;
    z-index: 10;
    margin-right: 1px;
    background-color: azure;
}

.chat-messages{
    background-color: rgb(212, 248, 236);
    flex: 1;
    overflow-y: auto;
    margin-right: 1px;
    margin-top: 65px;
}

.typing-messages {
    display:flex;
    width: 100%;
    height: 10%;
    border-bottom-right-radius: 4px;
    z-index: 10;
    background-color: rgb(250, 228, 217);
}
.add-chat{
    form{ 
        display: flex;
        flex-direction: column;
    }
    display:flex;
    flex-direction:column;
    align-items: center;
}
</style>