<script lang="ts">
	import "../app.postcss";
	import { windowTitle } from "@stores/globals";
	import { authed } from "@stores/user";
	import { browser } from "$app/environment";
	import { Button, Icon, Loader } from "@components";
	import { fade, fly } from "svelte/transition";
	import { Confirm } from "@features/confirm";
	import Backdrop from "@components/Backdrop.svelte";
	import { onMount } from "svelte";
	import { toggle } from "svelte-machinery";

	$: inGlobalLoadState = !browser || $authed === null;

	let ctaOpen = toggle();

	onMount(() => {
		if (!localStorage.getItem("cta")) {
			ctaOpen.off();
		}
	});

	const handleCTA = () => {
		localStorage.setItem("cta", "true");
		ctaOpen.off();
	};
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

	<Backdrop bind:open={$ctaOpen}>
		<!-- Call to action -->
		<div
			transition:fly={{ y: 200, duration: 500 }}
			class="absolute bottom-0 left-0 flex w-full items-center gap-4 bg-offwhite p-8"
		>
			<Icon name="cookie_off" customSize="2.4rem" outlined color="gray-400" />

			<div class="flex flex-col gap-1">
				<span class="text font-medium"> This is a cookieless website! No need to accept anything. </span>
				<span class="text text-xs text-gray-400">
					We take pride in our users' security and privacy, and by utilising no cookies - we can ensure that
					no external sites are tracking your data.
				</span>
			</div>

			<Button className="ml-auto" style="primary" on:click={handleCTA}>
				Okay, got it
				<Icon name="check" />
			</Button>
		</div>
	</Backdrop>
{/if}