<script lang="ts">
	import { enter } from "sveltils/actions";
	import { createEventDispatcher } from "svelte";

	export let label: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let value = "";
	export let className: string | undefined = undefined;
	export let autofocus = false;
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
				<span class="ml-auto text-gray-500 text-xs font-light">({value.length}/{limit})</span>
			{/if}
		</label>
	{/if}
	<div class="w-full flex gap-2 items-center outlined-input {className}">
		{#if $$slots.start}
			<slot name="start"/>
		{/if}
		<input
			class="bg-transparent w-full text-overflow focus:outline-none"
			{placeholder}
			{required}
			maxlength={limit}
			pattern={pattern?.source}
			{disabled}
			type="text"
			use:enter
			{autofocus}
			on:enter={() => dispatch("enter")}
			bind:value
			{id}
		/>
		{#if $$slots.end}
			<slot name="end" />
		{/if}
	</div>
	{#if value && (pattern && !pattern.test(value))}
		<span class="text-xs text-red-500">{invalidMessage}</span>
	{:else if caption}
		<span class="text-xs text-gray-500">{caption}</span>
	{/if}
	
</div>
