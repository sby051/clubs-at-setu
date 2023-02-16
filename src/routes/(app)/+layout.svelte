<script lang="ts">
	import Sidebar from "./Sidebar.svelte";
	import Navbar from "./Navbar.svelte";
	import user, { authed } from "@stores/user";

	let loading = true;

	$: if ($authed === false) {
		window.location.href = "/login";
	}

	let width: number;

	$: mobile = width < 768;

</script>

<svelte:window bind:innerWidth={width} />

<div class="flex h-full flex-col bg-offwhite">
	{#if mobile}
		<Navbar />
	{/if}

	<div class="flex flex-col lg:flex-row h-full overflow-hidden">
		{#if !mobile}
			<Sidebar/>
		{/if}

		<main class="w-full h-full overflow-hidden">
			<slot />
		</main>

		{#if mobile}
			<div class="fixed bottom-0 left-0 w-screen">
				<Sidebar/>
			</div>
		{/if}
	</div>

	{#if !mobile}
		<Navbar />
	{/if}
</div>
