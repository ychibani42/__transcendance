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
			<button class="material-icons">+
				<h6>add a friend</h6>
				<UserList />
			</button>

		</div>

		<div class="flex"></div>
	</aside>
</template>

<script lang="ts" setup>
import UserList from './UserList.vue'
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
		font-size: 0.875rem;
		color: var(--light);
		transition: 0.2s ease-in-out;
		h6{
			margin: 0.5rem 0.2rem;
		}
		&:hover {
				background-color: var(--dark-alt);
				color: var(--primary);
				border: 1px solid #f7f8f7;
				border-radius: 4px;
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




	@media (max-width: 1024px) {
		position: absolute;
		z-index: 99;
	}
}
</style>