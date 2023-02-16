<script lang="ts">
	import { page } from "$app/stores";

	import { Button, Icon } from "@components";
	import { backInOut } from "svelte/easing";
	import { blur } from "svelte/transition";

	const { error, status } = $page;

	const MESSAGES = {
		404: "<b>Couldn't find the page you were looking for. </b> <br/> Please check the link and try again.",
		500: "<b> Oops! Something went wrong.</b><br/> Please try again later.",
	};
</script>

<div class="grid place-items-center h-full">
	<div
		transition:blur={{ duration: 1200, easing: backInOut }}
		class="w-1/8 flex flex-col items-center justify-center gap-4 rounded-lg border-[1px] border-gray-300 bg-white p-24 transition"
	>
		<span class="text text-md lg:text-md text-center">
			{@html status in MESSAGES ? MESSAGES[status] : error.message}
		</span>
		<Button style="primary" on:click={() => window.history.back()}>
			<Icon name="refresh" outlined size="lg" />
			Refresh page
		</Button>
	</div>
</div>
