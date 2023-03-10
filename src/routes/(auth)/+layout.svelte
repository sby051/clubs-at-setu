<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Button, Icon } from "@components";
	import { authed } from "@stores/user";
	import { onMount } from "svelte";

	let showBackButton = true;

	const ALLOWED_PATHS_WITH_AUTH = ["/password/change"];

	onMount(async () => {
		const { pathname } = $page.url;

		if ($authed && !ALLOWED_PATHS_WITH_AUTH.includes(pathname)) {
			await goto("/");
		}

		showBackButton = history.length > 1;
	});
</script>

<div class="flex-center-column relative h-screen gap-4">
	{#if showBackButton}
		<Button className="absolute top-3 left-3" on:click={() => history.back()} size="sm" style="outlined:normal">
			<Icon name="keyboard_backspace" />
			Go back
		</Button>
	{/if}
	<slot />
</div>
