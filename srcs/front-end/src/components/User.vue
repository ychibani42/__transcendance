<template>
    <div>
        <h1>ici</h1>
        <h2> {{ user }}</h2>
    </div>
</template>

<script lang="ts" name="User">
import axios from 'axios';

export default {
  data() {
    return {
      access_token: null,
	  loading: true,
      user: ''
    }
  },
  created() {
    // Fetch the user when the component is created
    this.fetchUser()
  },
  methods: {
    async fetchUser() {
      try {
        const response = await axios.post(`http://localhost:3000/auth/signIn/`, {
		    username: 'bob',
		  	// password: 'bob123',
		});
        this.access_token = response.data.access_token;
		    this.loading = false;
      } catch (error) {
        console.error('Error fetching user:', error);
		this.loading = false;
      }
    },
    mounted(){
      axios.get(`http://localhost:3000/auth/signIn/`)
      .then(res => {
        console.log(res.data.data)
        this.user = res.data
      })
      .catch(err => console.log(err))
    }
  },
};
</script>
