<script lang="ts">
	import { Button } from "@components";
	import { logout } from "@fb/auth";
    import user from "@stores/user";
	import { Avatar } from "@components";
	import logo from "@assets/logo.png";
</script>

<main class="h-full flex-center-column gap-4" aria-label="Home">
	<div class="raised-card items-center">
		<Avatar src={logo} size="128px"/>
		<span class="text-center text-gray-900 font-semibold text-xl">Welcome to Clubs @ SETU {$user?.firstName}!</span>	
		<Button fillWidth href="/clubs" style="primary">Find a club</Button>
		<Button fillWidth style="outlined:danger" on:click={logout}>Log Out</Button>
	</div>
</main>