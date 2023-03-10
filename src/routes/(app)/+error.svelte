<script lang="ts">
	import { page } from "$app/stores";
	import { windowTitle } from "@stores/globals";

	import { Button, Icon } from "@components";
	import { backInOut } from "svelte/easing";
	import { blur } from "svelte/transition";

	const { error, status } = $page;

	const MESSAGES = {
		404: "<b>Sorry, this club doesn't exist.</b> <br/> Please check the link and try again.",
		500: `<b> Oops! Something went wrong.</b><br/> Please try again later. <br/> ${error.message}`,
	};

	windowTitle.set(status.toString());
</script>

<div class="grid w-full h-full place-items-center">
	<div
		transition:blur={{ duration: 1200, easing: backInOut }}
		class="w-1/8 flex flex-col items-center justify-center gap-4 rounded-lg border-[1px] border-gray-300 bg-white p-24 transition"
	>
		<span class="text text-md lg:text-md text-center">
			{@html status in MESSAGES ? MESSAGES[status] : error.message}
		</span>
		<Button style="primary" on:click={() => window.location.reload()}>
			<Icon name="refresh" outlined size="lg" />
			Refresh page
		</Button>
	</div>
</div>