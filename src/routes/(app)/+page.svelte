<script lang="ts">
	import { Button } from "@components";
	import { signOut } from "@fb/auth";
	import user from "@stores/user";
	import logo from "@assets/logo.png";
	import { windowTitle } from "@stores/globals";

	$windowTitle = "Home";
</script>

<main class="flex-center-column h-full gap-4" aria-label="Home">
	<div class="raised-card items-center">
		<img src={logo} class="w-[128px]" alt="setu logo" />
		<span class="text-center text-xl font-semibold text-gray-900">Welcome to Clubs @ SETU {$user.firstName}!</span>
		<Button fillWidth href="/clubs" style="primary">Find a club</Button>
		<Button fillWidth style="outlined:danger" on:click={signOut}>Sign Out</Button>
	</div>
</main>
