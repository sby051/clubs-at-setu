<script lang="ts">
	import "../app.postcss";
	import { windowTitle } from "@stores/globals";
	import { authed } from "@stores/user";
	import { browser } from "$app/environment";
	import { Loader } from "@components";
	import { fade } from "svelte/transition";
	import { Confirm } from "@features/confirm";

	$: inGlobalLoadState = !browser || $authed === null;
</script>

<svelte:head>
	<title>{$windowTitle ? `${$windowTitle} / ` : ""}Clubs @ SETU</title>
</svelte:head>

<Confirm />

{#if inGlobalLoadState}
	<div
		transition:fade
		class="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center gap-1 overflow-hidden"
	>
		<Loader />
		<span class="text text-sm font-medium">Getting things ready..</span>
	</div>
{:else}
	<div in:fade={{ delay: 400 }} aria-label="App viewport">
		<slot />
	</div>
{/if}

<style lang="postcss">
	:global(body) {
		@apply bg-offwhite;
	}
</style>
