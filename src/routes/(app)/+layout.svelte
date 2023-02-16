<script lang="ts">
	import Sidebar from "./Sidebar.svelte";
	import Navbar from "./Navbar.svelte";
	import { authed } from "@stores/user";
	import { page } from "$app/stores";

	$: if ($authed === false) {
		window.location.href = "/login";
	}

</script>

<div class="flex h-full flex-col bg-offwhite">
	<div class="flex flex-col lg:flex-row w-full h-full overflow-hidden">
		<Sidebar/>

		{#key $page}
			<main class="flex flex-col h-full w-full">
				<Navbar />
				<slot />
			</main>
		{/key}
	</div>
</div>
