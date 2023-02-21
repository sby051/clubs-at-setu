<script lang="ts">
	import { Button, Icon, IconButton } from "@components";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	let image = {
		url: null,
		file: null,
	};

	let accepted = false;

	const handleFileInputChange = (event: InputEvent) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const { result } = reader;
				if (result) {
					image = {
						url: result,
						file,
					};
				}
			};
		}
	};

	const handleAccept = () => {
		dispatch("picked", image);
		accepted = true;
	};

	const handleCancel = () => {
		image = {
			url: null,
			file: null,
		};
	};

	const handleImageClick = () => {
		accepted = false;
		const input = document.getElementById("image-picker");
		if (input) input.click();
	};
</script>

<div class="flex-center-column h-full w-full gap-3 rounded-lg border-[1px] border-gray-300 p-5">
	<div class="grid w-full place-items-center">
		<div
			class="relative aspect-square w-36 gap-2 overflow-hidden rounded-full outline-dotted outline-1 outline-offset-2 outline-gray-400"
		>
			{#if image.url}
				<img
					src={image.url}
					alt="Selected Image"
					class="pointer-events-none absolute top-0 left-0 z-40 h-full w-full"
				/>
			{/if}

			<button
				type="button"
				class="flex-center-col absolute top-0 left-0 z-10 h-full w-full"
				on:click={handleImageClick}
				title="Click to change image"
			>
				<Icon name="add_a_photo" color="gray-400" size="2xl" />
				<span class="text text-sm text-gray-400">Click to choose</span>
			</button>

			<input
				required
				type="file"
				id="image-picker"
				accept="image/*"
				class="hidden"
				on:change={handleFileInputChange}
			/>
		</div>
	</div>

	{#if image.url && !accepted}
		<div class="flex-center gap-2">
			<Button style="outlined:danger" size="sm" on:click={handleCancel}>Cancel</Button>
			<Button style="primary" size="sm" on:click={handleAccept}>
				<Icon name="check" />
				Accept
			</Button>
		</div>
	{:else}
		<span class="text mt-2 text-center text-xs text-gray-500">
			This photo is used to identify you when you sign in to the app. It is not shared with anyone.
		</span>
	{/if}
</div>
