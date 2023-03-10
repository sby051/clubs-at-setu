<script lang="ts">
	import { page } from "$app/stores";
	import { Button, Icon, TextInput } from "@components";

	const code = $page.url.searchParams.get("oobCode");

	let written = false;

	const copyToClipboard = async () => {
		if (!navigator) return;
		await navigator.clipboard.writeText(code as string);
		written = true;
		setTimeout(() => {
			written = false;
		}, 1000);
	};
</script>

<span class="text text-2xl font-bold">Confirmation Code</span>

<div class="raised-card">
	{#if code}
		<span class="text text-sm text-gray-600">Copy the code below and paste it into your original tab</span>
		<div class="flex items-center gap-2">
			<TextInput value={code} readonly />
			<Button disabled={written} className="h-full" size="sm" style="primary" on:click={copyToClipboard}>
				{#if written}
					<Icon name="check" />
					Copied!
				{:else}
					<Icon name="content_copy" />
					Copy
				{/if}
			</Button>
		</div>
	{:else}
		<span class="text">No code found. Please try again.</span>
	{/if}
</div>
