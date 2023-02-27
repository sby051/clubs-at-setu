<script lang="ts">
	import { Button, Drawer, Icon, TextInput } from "@components";
	import user from "@stores/user";
	import { deleteAccount, logout } from "@fb/auth";
	import { fade, slide } from "svelte/transition";
	import { Avatar } from "@components";
	import { goto } from "$app/navigation";
	import { confirm } from "@features/confirm";

	type QuickAction = {
		icon: string;
		title: string;
		fn: VoidFunction;
	};

	const QUICK_ACTIONS: QuickAction[] = [
		{
			icon: "join",
			title: "Find a club",
			fn: () => goto("/clubs"),
		},
	];

	let createDrawerOpen = false;

	if ($user?.admin) {
		QUICK_ACTIONS.push({
			icon: "add",
			title: "Create club",
			fn: () => (createDrawerOpen = true),
		});
	}

	const ACCOUNT_SETTINGS: QuickAction[] = [
		{
			icon: "password",
			title: "Change password",
			fn: () => goto("/change-password"),
		},
		{
			icon: "logout",
			title: "Log out",
			fn: async () => {
				if (await confirm("Are you sure you want to log out?", { icon: "logout" })) {
					await logout();
				}
			},
		},
		{
			icon: "database",
			title: "Request your data",
			fn: () => {},
		},
		{
			icon: "delete",
			title: "Delete account",
			fn: async () => {
				const confirmed = await confirm("Delete account", {
					icon: "delete",
					message: "Are you sure you want to delete your account? This action cannot be undone.",
					buttons: {
						cancel: {
							text: "Nevermind",
							style: "outlined:normal",
						},
						confirm: {
							text: "Delete",
							icon: "delete",
							style: "danger",
						},
					},
					confirmationInput: {
						label: "Type your Student ID below to confirm (all caps)",
						placeholder: "Student ID",
						expectedValue: $user?.studentId as string,
					},
				});

				if (!confirmed) return;

				const deleted = await deleteAccount();

				if (deleted) {
					alert("Account successfully deleted.");
					await goto("/");
				}
			},
		},
	];
</script>

<Drawer width="1/2" bind:open={createDrawerOpen} title="Create club">
	<TextInput label="Name" placeholder="Club name" />
	<TextInput limit={255} label="Description" placeholder="Club description" />
	<TextInput label="Categories" placeholder="Athletics etc.." />

	<svelte:fragment slot="footerButtons">
		<Button fillWidth style="outlined:normal">Cancel</Button>
		<Button fillWidth style="primary">
			<Icon name="group_add" size="lg" />
			Create club
		</Button>
	</svelte:fragment>
</Drawer>

<div
	transition:fade={{ duration: 100 }}
	class="relative z-20 flex w-96 flex-col gap-4 overflow-hidden rounded-md border-[1px] border-gray-300 bg-offwhite py-6 shadow-md transition"
>
	<div class="flex flex-col items-center justify-center gap-3 py-4">
		<Avatar size="100px" src={$user?.photo} />

		<span class="overflow-hidden text-ellipsis whitespace-nowrap text-center text-2xl font-bold">
			{$user?.firstName}
		</span>

		<span class="text text-center text-sm">
			{$user?.email}
		</span>
	</div>

	<span class="separator-h" />

	<span class="text px-6 text-sm font-semibold">Account</span>

	<div class="flex flex-col">
		{#each ACCOUNT_SETTINGS as accountSetting, i}
			<button
				on:click={accountSetting.fn}
				transition:slide|local={{ duration: 200 }}
				class="flex w-full cursor-pointer gap-2 px-6 py-3 transition active:bg-gray-300 hover:bg-{accountSetting.hoverColor ||
					'gray-300'}"
			>
				<Icon name={accountSetting.icon} outlined size="lg" />
				<span class="text overflow-hidden text-ellipsis whitespace-nowrap text-sm"
					>{accountSetting.title}</span
				>
			</button>
		{/each}
	</div>
</div>
