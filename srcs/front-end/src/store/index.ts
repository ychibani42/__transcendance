import { createStore} from "vuex";
import { Socket } from "socket.io-client";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


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
                Twofavalid : true,
                online : false
            }, 
            chandisp :{
                idch: 0,
                channame: '',
                messages: [],
                user: [],
                oldChatId: 0,
                ownerId: 0,
                is_private: false,
                banned: [],
                admin: [],
                muted: [],
            },
            gamesock:null,
            chatsock: null,
            gamename:'',
            gameplay:false,
            gameTheme : false,
            state: <Socket | undefined>null
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
                state.chandisp.user = chandisp.user,
                state.chandisp.oldChatId = chandisp.oldChatId,
                state.chandisp.ownerId = chandisp.ownerId,
                state.chandisp.is_private = chandisp.is_private
                state.chandisp.banned = chandisp.banned
                state.chandisp.muted = chandisp.muted
                state.chandisp.admin = chandisp.admin
            },
            setChanid(state, id: number){state.chandisp.idch = id},
            setTwofa(state, bool){ state.user.Twofa = bool},
            setTwofavalid(state, bool){ state.user.Twofavalid = bool},
            setGamename(state, name){ state.gamename = name},
            setGameplay(state, play){ state.gameplay = play},
            setState(state, sock){ state.state = sock},
            setOnline(state, bool){state.user.online = bool},
            setTheme(state , bool){ state.gameTheme = bool},
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
                this.state.user.online = false
                if(this.state.state)
                    this.state.state.disconnect()
            },
            jwtExpired()
            {
                toast("JWT INVALID", {
                    autoClose: false,
                    closeOnClick: false,
                })
            },
            Notification(text , text2)
            {
                toast(text, {
                    autoClose: false,
                    closeOnClick: false,
                })
            }
        }
    }
)

export default store