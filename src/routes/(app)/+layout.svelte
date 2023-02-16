<script lang="ts">
	import Sidebar from "./Sidebar.svelte";
	import Navbar from "./Navbar.svelte";
	import user, { authed } from "@stores/user";

	let loading = true;

	$: if ($authed === false) {
		window.location.href = "/login";
	}
</script>

<div class="flex h-full flex-col bg-offwhite">
	<div class="flex h-full overflow-hidden">
		<Sidebar/>

		<main class="w-full h-full overflow-hidden">
			<slot />
		</main>
	</div>

	<Navbar />
</div>
