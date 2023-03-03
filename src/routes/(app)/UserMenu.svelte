<script lang="ts">
	import { Icon } from "@components";
	import user from "@stores/user";
	import { deleteAccount, signOut } from "@fb/auth";
	import { slide } from "svelte/transition";
	import { Avatar } from "@components";
	import { goto } from "$app/navigation";
	import { confirm } from "@features/confirm";
	import { getFileURL } from "@fb/storage";
	import type { Category } from "@types";
	import { clickoutside } from "sveltils/actions";
	import { onMount } from "svelte";

	const SETTINGS: { fn: () => any } & Category = [
		{
			icon: "password",
			title: "Change password",
			fn: () => goto("/password/change"),
		},
		{
			icon: "logout",
			title: "Log out",
			fn: async () => {
				if (await confirm("Are you sure you want to log out?", { icon: "logout" })) {
					await signOut();
				}
			},
		},
		{
			icon: "database",
			title: "Request your data",
			fn: () => goto("/request-data"),
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
						}
					},
					confirmationInput: {
						label: "Type your Student ID below to confirm (all caps)",
						placeholder: "Student ID",
						expectedValue: $user.studentId as string,
					}
				});

				if (!confirmed) return;

				const deleted = await deleteAccount();

				if (deleted) {
					await goto("/");
					alert("Account successfully deleted.");
				}
			},
		},
	];

	const openClose = () => open = !open;

	let open = false;

	let userPhoto = $user.photo;
</script>

<section class="relative" aria-label="User area">
	<Avatar src={userPhoto} on:click={openClose} />
	{#if open}
		<div transition:slide class="z-20 flex w-96 flex-col gap-4 overflow-hidden rounded-md border-[1px] border-gray-300 bg-offwhite py-6 shadow-md transition absolute right-0 top-10" use:clickoutside on:clickoutside={openClose}>
			<div class="flex flex-col items-center justify-center gap-3 py-4">
				<Avatar size="100px" src={userPhoto} />
		
				<span class="overflow-hidden text-ellipsis whitespace-nowrap text-center text-2xl font-bold">
					{$user.firstName}
				</span>
		
				<span class="text text-center text-sm">
					{$user.email}
				</span>
			</div>
		
			<span class="separator-h" />
		
			<span class="text px-6 text-sm font-semibold">Settings</span>
		
			<div class="flex flex-col">
				{#each SETTINGS as setting, i}
					<button
						on:click={setting.fn}
						transition:slide|local={{ duration: 200 }}
						class="flex w-full cursor-pointer gap-2 px-6 py-3 transition active:bg-gray-300 hover:bg-gray-200"
					>
						<Icon name={setting.icon} outlined size="lg" />
						<span class="text overflow-hidden text-ellipsis whitespace-nowrap text-sm">{setting.title}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</section>