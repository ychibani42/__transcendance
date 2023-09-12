import { createStore } from "vuex";


const store = createStore(
    {
        state:{
            user:{
                id: 0,
                username: '',
                profileCompleted: false,
                blocked: [],
                friend: [],
                first : true
            },
            gamesock:null,
            gamename:'',
            gameplay:false
        },
        getters:{
            getuser : state => state.user,
            getGamesocket : state => state.gamesock,
            getGamename : state => state.gamename,
            getGameplay : state => state.gameplay,
        },
        mutations:{
            setUser(state , User){ state.user = User},
            setUserId(state , id :number){ state.user.id = id },
            setUsername(state , name : string){state.user.username = name},
            setBlocked(state , listblock){ state.user.blocked = listblock},
            setProfileC(state , bool){ state.user.profileCompleted = bool},
            setFriend(state , friend){ state.user.friend = friend},
            setF(state , bool){ state.user.first = bool},
            setGamesocket(state, socket){ state.gamesock = socket},
            setGamename(state, name){ state.gamename = name},
            setGameplay(state, play){ state.gameplay = play},
        },
        actions:{

        }
    }
)

export default store