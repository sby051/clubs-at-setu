<script lang="ts">
	import "../app.postcss";
	import { windowTitle } from "@stores/globals";
	import { authed } from "@stores/user";
	import { browser } from "$app/environment";
	import { HourglassLoader } from "@components";
	import { fade } from "svelte/transition";
	import { navigating } from "$app/stores";
	import { Confirm } from "@features/confirm";
	
	$: inGlobalLoadState = !browser || $authed === null;
</script>

<svelte:head>
	<title>{$windowTitle ? `${$windowTitle} / ` : ""}Clubs @ SETU</title>
</svelte:head>

<Confirm />

{#if $navigating}
	<div class="fixed top-0 left-0 h-1 w-screen animate-pulse bg-sky-400 duration-75" />
{/if}

{#if inGlobalLoadState}
	<div
		transition:fade
		class="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center gap-1 overflow-hidden"
	>
		<HourglassLoader />
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
