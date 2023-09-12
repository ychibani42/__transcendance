import { createStore } from "vuex";


const store = createStore(
    {
        state:{
            user:{
                id: 0,
                username: '',
                profileCompleted: false,
                blocked: [],
                friend: []
            },
            chandisp :{
                idch: 0,
                channame: '',
                messages: [],
                user: []
            },
            gamesock:null,
            chatsock: null,
        },
        getters:{
            getuser : state => state.user,
            getGamesocket : state => state.gamesock,
            getChandisp : state => state.chandisp,
            getChansocket: state => state.chatsock
        },
        mutations:{
            setUser(state , User){ state.user = User},
            setUserId(state , id :number){ state.user.id = id },
            setUsername(state , name : string){state.user.username = name},
            setBlocked(state , listblock){ state.user.blocked = listblock},
            setProfileC(state , bool){ state.user.profileCompleted = bool},
            setFriend(state , friend){ state.user.friend = friend},
            setGamesocket(state, socket){ state.gamesock = socket},
            setChatsocket(state, socket){state.chatsock = socket},
            setChandisp(state, chandisp) {
                state.chandisp.idch = chandisp.idch,
                state.chandisp.channame = chandisp.channame,
                state.chandisp.messages = chandisp.messages,
                state.chandisp.user = chandisp.user

            },
            setChanid(state, id: number){state.chandisp.idch = id}
        },
        actions:{

        }
    }
)

export default store