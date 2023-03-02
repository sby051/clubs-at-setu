<script lang="ts">
	import { authed } from "@stores/user";
	import { page } from "$app/stores";
	import NavBar from "./NavBar.svelte";
	import SideBar from "./SideBar.svelte";
	import { Icon } from "@components";
	import { fly } from "svelte/transition";

	const scrollToTop = () => {
		document.getElementById("app-content")?.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleScroll = (e: any) => scrolled = e.target.scrollTop > 100;
	
	let scrolled = false;

	$: if ($authed === false) window.location.href = "/sign/in";
</script>

<div class="flex h-[100dvh] w-[100dvw] overflow-hidden" aria-label="App layout">
	<SideBar/>

	<div class="relative w-full">
		<NavBar/>

		{#key $page}
			<div on:scroll={handleScroll} id="app-content" aria-label="App Content" class="scroll-y relative pt-16 h-full">
				<slot />
				{#if scrolled}
					<button transition:fly={{y: 400}} on:click={scrollToTop} class="z-50 text-white hover:scale-125 focus:scale-100 transition bg-violet-500/80 backdrop-blur-sm bottom-8 right-8 fixed shadow-lg w-12 h-12 rounded-full flex-center-column">
						<Icon name="arrow_upward"/>
					</button>
				{/if}
			</div>
		{/key}
	</div>
</div>
