<script lang="ts">
	import { authed } from "@stores/user";
	import { navigating, page } from "$app/stores";
	import NavBar from "./NavBar.svelte";
	import SideBar from "./SideBar.svelte";
	import { Icon } from "@components";
	import { fly, blur, slide } from "svelte/transition";

	const scrollToTop = () => {
		document.getElementById("app-content")?.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleScroll = (e: any) => (scrolled = e.target.scrollTop > 100);

	let scrolled = false;

	$: if ($authed === false) window.location.href = "/sign/in";
</script>

<div class="flex h-[100dvh] w-[100dvw] overflow-hidden" aria-label="App layout">
	<SideBar />

	<div class="relative w-full">
		<NavBar />

		{#key $page}
			<div
				on:scroll={handleScroll}
				id="app-content"
				aria-label="App Content"
				class="scroll-y relative h-full pt-16"
			>
				{#if $navigating}
					<div
						class="flex-center-column fixed z-50 h-full w-full bg-offwhite/60 backdrop-blur-md"
						transition:blur
					>
						<span class="text text-medium animate-pulse text-sm text-gray-500"> Going somewhere... </span>
					</div>
				{/if}
				
				<slot />

				{#if scrolled}
					<button
						transition:fly={{ y: 400 }}
						on:click={scrollToTop}
						class="flex-center-column fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full bg-violet-500/80 text-white shadow-lg backdrop-blur-sm transition hover:scale-125 focus:scale-100"
					>
						<Icon name="arrow_upward" />
					</button>
				{/if}
			</div>
		{/key}
	</div>
</div>
