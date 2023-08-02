<template>
  <div>
    <h1>User Information</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <p>Name: {{ access_token }}</p>
      <!-- Add other user properties as needed -->
    </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  data() {
    return {
      access_token: null,
	  loading: true
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
			password: 'bob123',
		});
        this.access_token = response.data.access_token;
		this.loading = false;
      } catch (error) {
        console.error('Error fetching user:', error);
		this.loading = false;
      }
    },
  },
};

</script>