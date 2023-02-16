<script lang="ts">
	import { REGEXES } from "@utils/constants";

	export let label = "Password";
	export let placeholder = "s3cr3tP@ssw0rd";
	export let value = "";
	export let usePattern = false;
	export let autofocus = false;

	const id = `password-input-${Math.random().toString(36).substring(2, 9)}`;
</script>

<div class="flex w-full flex-col gap-2">
	{#if label}
		<label for={id} class="text-sm font-medium text-gray-600">{label}</label>
	{/if}
	<input {autofocus} pattern={usePattern ? REGEXES.PASSWORD.source : null} class="outlined-input" {placeholder} type="password" bind:value {id} />
	{#if usePattern && value && !REGEXES.PASSWORD.test(value)}
		<p class="text-xs text-red-500">Password must contain at least 8 characters and 1 uppercase letter, lowercase letter, number and special character</p>
	{/if}
</div>
