<template>
    
    <div class="profile">
      <img src="../assets/logo.png" class="default">
      <h1>{{ name }}</h1>
      <p>Edit Avatar: <input type="file" class="avatar" @change="editImage"> </p>
      <p>Edit Name: <input type="text" class="name" @change="editName"></p> 
      <User />
      <button @click="btn2FA">BTN 2FA</button>
    </div>
</template>
  
<script lang="ts">
import Axios from '../services';

export default {
  data () {
    return {
     def: null,
     name: 'Name'
    }
  },
  methods: {
    editImage(event) {
        const img = event.target.files[0];
         this.def = img.name;
     // const image = this.$el.querySelector(".newfile");
        this.$el.querySelector(".default").src = "/src/assets/" + this.def;
        console.log(this.$el.querySelector(".default"))
		Axios.post("users/upload", {img});
    },
    editName() {
      this.name = this.$el.querySelector(".name").value;
      this.$el.querySelector(".name").value = "";
    },
    btn2FA()
    {
      Axios.post("Auth/Button2FA",{id : 1});
      console.log("here");
    }
  }
};
</script>

<style lang="scss" scoped>
  
.profile{
    display: flex;
    flex-direction: column;
    align-content: center;
    flex-wrap: wrap;
    align-items: center;
  h1{
    padding:5px;
  }
  input[type="text"] {
      width:200px;
      height:30px;
      border-radius:5px;
      background-color: lightblue;
      margin-left:2px;
  }

    p {
      // margin: 0 300px;
      text-align:left;
      padding:10px;
      font-family:AR CENA;
      font-size:20px;

    }
  .default {
    // margin:50px 400px 0;
    width: 42;
    height: 1;
    border: 2px solid;
    border-radius: 50%;
    border-color: black;
    background-color: rgb(118, 150, 180);

    }

  }
  </style>