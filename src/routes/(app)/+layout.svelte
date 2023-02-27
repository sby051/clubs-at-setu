<script lang="ts">
	import { authed } from "@stores/user";
	import { page } from "$app/stores";
	import NavBar from "./NavBar.svelte";
	import SideBar from "./SideBar.svelte";

	$: if ($authed === false) window.location.href = "/login";
</script>

<div class="flex h-[100dvh] w-[100dvw] overflow-hidden" aria-label="App layout">
	<SideBar/>

	<div class="relative w-full">
		<NavBar/>

		{#key $page}
			<div aria-label="App Content" class="scroll-y relative mt-16 h-full pb-16">
				<slot />
			</div>
		{/key}
	</div>
</div>
