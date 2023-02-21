<script lang="ts">
	type ButtonStyle = keyof typeof STYLES;
	type ButtonSize = keyof typeof SIZES;

	export let style: ButtonStyle = "normal";
	export let size: ButtonSize = "base";
	export let fillWidth = false;
	export let href: string | undefined = undefined;
	export let className: string | undefined = undefined;
	export let loadingText = "Loading...";
	export let loading = false;
	export let type = "button";
	export let disabled = false;

	const STYLES = {
		normal: "bg-offblack text-white",
		primary: "bg-violet-500 text-white",
		secondary: "bg-secondary text-white",
		inverted: "bg-offwhite text-offblack",
		warning: "bg-yellow-500 text-white",
		success: "bg-olive-500 text-white",
		danger: "bg-red-500 text-white",
		"outlined:normal": "bg-transparent border-[1px] border-gray-300 text-gray-500",
		"outlined:primary": "bg-transparent border-[1px] border-violet-500 text-violet-500",
		"outlined:secondary": "bg-transparent border-[1px] border-secondary text-secondary",
		"outlined:inverted": "bg-transparent border-[1px] border-offwhite text-offwhite",
		"outlined:warning": "bg-transparent border-[1px] border-yellow-500 text-yellow-500",
		"outlined:success": "bg-transparent border-[1px] border-green-500 text-green-500",
		"outlined:danger": "bg-transparent border-[1px] border-red-500 text-red-500",
		"ghost:primary": "bg-transparent text-primary",
		"ghost:secondary": "bg-transparent text-secondary",
		"ghost:inverted": "bg-transparent text-offwhite",
		"ghost:warning": "bg-transparent text-yellow-500",
		"ghost:success": "bg-transparent text-green-500",
		"ghost:normal": "bg-transparent text-black",
		"ghost:danger": "bg-transparent text-red-500",
	};

	const SIZES = {
		xs: "px-3 py-2 text-2xs font-semibold",
		sm: "px-3 py-2 text-xs font-semibold",
		base: "px-5 py-2.5 text-sm",
		md: "px-5 py-4 text-base",
		lg: "px-6 py-4 text-md",
		xl: "px-8 py-4 text-lg",
	};

	const TAG = href ? "a" : "button";
</script>

<svelte:element
	this={TAG}
	{type}
	{href}
	on:click
	on:keydown
	role="button"
	class:w-full={fillWidth}
	disabled={disabled || loading}
	class="flex flex-grow-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition duration-100 hover:bg-opacity-90 active:bg-opacity-80 disabled:bg-opacity-50 {STYLES[style]} {SIZES[size]} {className}"
>
	{#if loading}
		{loadingText}
	{:else}
		<slot />
	{/if}
</svelte:element>
