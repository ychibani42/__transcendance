import { createStore} from "vuex";


const store = createStore(
    {
        state:{
            user:{
                id: 0,
                username: '',
                profileCompleted: false,
                blocked: [],
                friend: [],
                first : true,
                Twofa : false
            },
           
            chandisp :{
                idch: 0,
                channame: '',
                messages: [],
                user: []
            },
            gamesock:null,
            chatsock: null,
                
            gamename:'',
            gameplay:false 
        },
        getters:{
            getuser : state => state.user,
            getGamesocket : state => state.gamesock,
            getChandisp : state => state.chandisp,
            getChansocket: state => state.chatsock,
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
            setGamesocket(state, socket){ state.gamesock = socket},
            setChatsocket(state, socket){state.chatsock = socket},
            setChandisp(state, chandisp) {
                state.chandisp.idch = chandisp.idch,
                state.chandisp.channame = chandisp.channame,
                state.chandisp.messages = chandisp.messages,
                state.chandisp.user = chandisp.user

            },
            setChanid(state, id: number){state.chandisp.idch = id},
            setF(state , bool){ state.user.first = bool},
            setTwofa(state, bool){ state.user.Twofa = bool},
            setGamename(state, name){ state.gamename = name},
            setGameplay(state, play){ state.gameplay = play},
        },
        action: {}
    }
)

export default store