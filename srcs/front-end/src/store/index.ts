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
                Twofa : false,
                Twofavalid : true
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
            gameplay:false,
            state:null
        },
        getters:{
            getuser : state => state.user,
            getGamesocket : state => state.gamesock,
            getChandisp : state => state.chandisp,
            getChansocket: state => state.chatsock,
            getGamename : state => state.gamename,
            getGameplay : state => state.gameplay,
            getState : state => state,
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
            setTwofa(state, bool){ state.user.Twofa = bool},
            setTwofavalid(state, bool){ state.user.Twofavalid = bool},
            setGamename(state, name){ state.gamename = name},
            setGameplay(state, play){ state.gameplay = play},
            setState(state, sock){ state.state = sock},
        },
        actions :{
            reset()
            {
                this.state.chandisp.channame = ""
                this.state.chandisp.idch = 0                
                this.state.chandisp.messages = []
                this.state.chandisp.user = []
                this.state.chatsock = null
                this.state.user.Twofavalid = true
                this.state.gamename = ""
                this.state.gamesock = null
                this.state.user.id = 0,
                this.state.user.username = '',
                this.state.user.profileCompleted =false,
                this.state.user.blocked = [],
                this.state.user.friend =[],
                this.state.user.Twofa = false
                if(this.state.state)
                    this.state.state.disconnect()
            }
        }
    }
)

export default store