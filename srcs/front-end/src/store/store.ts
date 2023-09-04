import { createStore } from "vuex";
import { Socket } from "socket.io-client";


const store = createStore(
    {
        state:{
            user:{
                id: null,
                username: '',
                avatarId: null,
                status: null,
                profileCompleted: false,
                otp: '',
                blocked: [],
                friend: []
            },
            gamesock:<Socket> <undefined>null,
        },
        getters:{
            getuser : state => state.user,
            getGamesocket : state => state.gamesock
        },
        mutations:{

        },
        actions:{

        }
    }
)

export default store