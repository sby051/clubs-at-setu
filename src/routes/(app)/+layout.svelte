<script lang="ts">
	import Sidebar from "./Sidebar.svelte";
	import Navbar from "./Navbar.svelte";
	import { authed } from "@stores/user";
	import { page } from "$app/stores";

	$: if ($authed === false) window.location.href = "/login";

</script>

<div class="flex h-screen w-screen overflow-hidden">
	<Sidebar/>
	
	<div class="flex flex-col relative w-full">
		<Navbar />
		{#key $page}
			<main class="min-h-full relative mt-16 pb-16 scroll-y">
				<slot />
			</main>
		{/key}
	</div>
</div>
