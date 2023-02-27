<script lang="ts">
	import { Backdrop, Button, Icon, TextInput } from "@components";
	import { confirmData, submitConfirm } from "./confirm";
	import { enter } from "sveltils/actions";
	import { backInOut } from "svelte/easing";
	import { scale } from "svelte/transition";

	let confirmInputValue = "";

	const handleConfirm = () => {
		if (canSubmit) submitConfirm(true);
	};

	$: canSubmit =
		!$confirmData?.confirmationInput || confirmInputValue === $confirmData.confirmationInput.expectedValue;
</script>

<svelte:window on:enter={handleConfirm} use:enter />

<Backdrop open={!!$confirmData}>
	<div class="grid h-full w-full place-items-center">
		<div class="raised-card max-w-[30rem] items-center" transition:scale={{ duration: 400, easing: backInOut }}>
			{#if $confirmData?.icon}
				<Icon name={$confirmData?.icon} customSize="3.5rem" color="gray-400" />
			{/if}

			<span class="text-center text-xl font-semibold">{$confirmData?.title}</span>

			{#if $confirmData?.message}
				<span class="text text-center text-gray-600">{$confirmData?.message}</span>
			{/if}

			{#if $confirmData?.confirmationInput}
				<TextInput
					bind:value={confirmInputValue}
					placeholder={$confirmData.confirmationInput.placeholder}
					label={$confirmData.confirmationInput.label}
				/>
			{/if}

			<div class="flex w-full items-center gap-1">
				<Button on:click={() => submitConfirm(false)} style={$confirmData.buttons.cancel.style} fillWidth>
					{#if $confirmData.buttons.cancel.icon}
						<Icon name={$confirmData?.buttons.cancel.icon} />
					{/if}
					{$confirmData.buttons.cancel.text}
				</Button>

				<Button
					on:click={handleConfirm}
					disabled={!canSubmit}
					style={$confirmData.buttons.confirm.style}
					fillWidth
				>
					{#if $confirmData.buttons.confirm.icon}
						<Icon name={$confirmData.buttons.confirm.icon} />
					{/if}
					{$confirmData.buttons.confirm.text}
				</Button>
			</div>
		</div>
	</div>
</Backdrop>
