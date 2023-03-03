<script lang="ts">
	import { enter } from "sveltils/actions";
	import { createEventDispatcher } from "svelte";

	export let label: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let value = "";
	export let className: string | undefined = undefined;
	export let autofocus = false;
	export let readonly = false;
	export let caption = "";
	export let required = false;
	export let pattern: RegExp | undefined = undefined;
	export let disabled = false;
	export let invalidMessage = "Invalid input";
	export let limit: number | undefined = undefined;

	const dispatch = createEventDispatcher();

	const id = `text-input-${Math.random().toString(36).substring(2, 9)}`;
</script>

<div class="flex w-full flex-col gap-1.5">
	{#if label}
		<label for={id} class="flex items-center text-sm font-medium text-gray-700">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
			{#if limit}
				<span class="ml-auto text-xs font-light text-gray-500">({value.length}/{limit})</span>
			{/if}
		</label>
	{/if}
	<input
		class="outlined-input flex items-center gap-2 {className}"
		{placeholder}
		{required}
		maxlength={limit}
		pattern={pattern?.source}
		{disabled}
		{readonly}
		type="text"
		use:enter
		{autofocus}
		on:enter={() => dispatch("enter")}
		bind:value
		{id}
	/>
	{#if value && pattern && !pattern.test(value)}
		<span class="text-xs text-red-500">{invalidMessage}</span>
	{:else if caption}
		<span class="text-xs text-gray-500">{caption}</span>
	{/if}
</div>
