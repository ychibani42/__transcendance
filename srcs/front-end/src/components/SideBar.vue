<template>
	<aside>
		<h3>Menu</h3>
		<div class="menu">
			<router-link to="/" class="button">
				<span class="material-icons">home</span>
			</router-link>
			<router-link to="/profile" class="button">
				<span class="material-icons">person</span>
			</router-link>
			<router-link to="/chat" class="button">
				<span class="material-icons">chat</span>
			</router-link>
			<router-link to="/game" class="button">
				<span class="material-icons">sports_tennis</span>
			</router-link>
			<button class="material-icon">
 	      		 <select name="add a friend">
           			 <option>Add</option>
           			 <option v-for="username in users" :key="username.id">{{username.username}}</option>  
     		   </select>    
			</button>

		</div>

		<div class="flex"></div>
	</aside>
</template>

<script lang="ts">
export default{
    name: 'UserList',
    data() {
        return {
            username: '',
            users: [
                {username:'eder', id:1},
                {username:'tea', id:2},
                {username: 'yassine', id:3},
            ]
        }
    }
}
</script>

<style lang="scss" scoped>



aside {

	display: flex;
	flex-direction: column;

	background-color: var(--dark);
	color: var(--light);

	width: calc(2rem + 32px);
	overflow: hidden;
	min-height: 100vh;

	transition: 0.2s ease-in-out;

  	margin: 0;
 	padding: 0;
	box-sizing: border-box;
	font-family: 'Fira sans', sans-serif;
	--primary: #4ade80;
	--grey: #64748b;
	--dark: #1e293b;
	--darkalt: #334155;
	--light: #f1f5f9;

	h3, .button .text {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

	h3 {
		color: var(--grey);
		font-size: 0.875rem;
		text-transform: uppercase;
	}

	
	button.material-icon {
		padding: 0;
		select {
			margin: 0px;
			color: var(--light);
			background-color: var(--dark);
			option h6{
				font-size: 0.5rem;
			}
				&:hover {
							color: var(--primary);
							border: 1px solid #f7f8f7;
							border-radius: 4px;
						}
			option {

				font-size: 1rem;
				color: var(--light);
				background-color: var(--dark);
				transition: 0.2s ease-in-out;
	
			}
		}
	}
	.menu {
		margin: 0 -1rem;
		align-items: center;
		
		.button {
			display: flex;
			justify-content: center;
			text-decoration: none;

			transition: 0.2s ease-in-out;
			padding: 1rem 1rem;

			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-in-out;
			}

			&:hover {
				background-color: var(--dark-alt);

				.material-icons {
					color: var(--primary);
				}
			}

			&.router-link-exact-active {
				background-color: var(--dark-alt);


				.material-icons {
					color: var(--primary);
				}
			}
		}

	}

}
</style>