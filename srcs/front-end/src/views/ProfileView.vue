
<template>
    <div class="profile">
      <img src="../assets/logo.png" class="default">
      <header>{{name}}</header>
      <p>Edit Avatar: <input type="file" class="avatar" @change="editImage"></p>
      <p>Edit Name: <input type="text" class="name" @change="editName"></p>
  
        <span > {{ def }}</span>
    <!-- //  <User /> -->
    </div>
  </template>
  
<script lang="ts">
export default {
  data () {
    return {
     def: null,
     name: 'Tea'
    }
  },
  methods: {
    editImage(event) {
        const img = event.target.files[0];
         this.def = img.name;
     // const image = this.$el.querySelector(".newfile");
        this.$el.querySelector(".default").src = "/src/assets/" + this.def;
        console.log(this.$el.querySelector(".default"))
    },
    editName() {
      this.name = this.$el.querySelector(".name").value;
      this.$el.querySelector(".name").value = "";
    }
  }
}
//import User from '../components/User.vue';
// export default {
//   data(){
//     return {
//       id: ''
//     }
//   },
//   methods: {
//   getId(event) {
//     this.id = event.target.value;
//     console.log(this.id);
//     //.innerHTML = x;
//     }
//   }
// }
</script>

  <style scoped>
  
  .profile {
    margin: 0 400px 0;
  }

  p {
    margin: 10px 20px 0;
    text-align: left;
  }

  .name {
    margin: 0 90px;
  }

  img {
    margin: 4rem 0 0;
    width: 42;
    height: 1;
    border: 2px solid;
    border-radius: 50%;
    border-color: black;
    background-color: rgb(118, 150, 180);

  }
  </style>