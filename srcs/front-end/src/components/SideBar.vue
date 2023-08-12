<template>
	<aside>
		<!-- <div class="logo">
			<img :src="logoURL" alt="Vue" /> 
		</div> -->

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
			<button class="material-icons">
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

<style lang="scss">
aside {
	display: flex;
	flex-direction: column;

	background-color: var(--dark);
	color: var(--light);

	width: calc(2rem + 32px);
	overflow: hidden;
	min-height: 100vh;
	padding: 1rem;

	transition: 0.2s ease-in-out;

	.flex {
		flex: 1 1 0%;
	}

	// .logo {
	// 	margin-bottom: 1rem;

	// 	img {
	// 		width: 2rem;
	// 	}
	// }


	

	h3, .button .text {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

	h3 {
		color: var(--grey);
		font-size: 0.875rem;
		text-transform: uppercase;
	}

	
	button.material-icons {
		padding: 1rem 0;
		select {
			margin: 1px;
			width: 50px;
			height: 50px;
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

		.button {
			display: flex;
			align-items: center;
			text-decoration: none;

			transition: 0.2s ease-in-out;
			padding: 1rem 1rem;

			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-in-out;
			}
			.text {
				color: var(--light);
				transition: 0.2s ease-in-out;
			}

			&:hover {
				background-color: var(--dark-alt);

				.material-icons, .text {
					color: var(--primary);
				}
			}

			&.router-link-exact-active {
				background-color: var(--dark-alt);
				border-right: 5px solid var(--primary);

				.material-icons, .text {
					color: var(--primary);
				}
			}
		}

	}




	@media (max-width: 2048px) {
		position: absolute;
		z-index: 99;
	}
}
</style>