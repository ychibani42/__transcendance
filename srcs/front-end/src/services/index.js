import axios from 'axios'
import router from '../router'

const Axios = axios.create({
    withCredentials :true,
    baseURL :"http://localhost:3000"
})

Axios.interceptors.response.use(response =>{
    return response;
},error => { 
    console.log(error)
    if(error.response.status == 401)
    {
        router.push("/login")
        return;
    }
});



export default Axios