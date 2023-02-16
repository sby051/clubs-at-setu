<script lang="ts">
	import { Icon, IconButton } from "@components";
	import user from "@stores/user";
	import { logout } from "@fb/auth";
	import { fade, slide } from "svelte/transition";
	import Avatar from "./Avatar.svelte";
	import { goto } from "$app/navigation";

	type QuickAction = {
		icon: string;
		title: string;
		hoverColor?: string;
		textColor?: string;
		fn: VoidFunction;
	};

	const QUICK_ACTIONS: QuickAction[] = [
		{
			icon: "join",
			title: "Find a club",
			fn: () => goto("/clubs"),
		}
	];

	const ACCOUNT_SETTINGS: QuickAction[] = [
		{
			icon: "payment",
			title: "Payment methods",
			fn: () => {},
		},
		{
			icon: "password",
			title: "Change password",
			fn: () => {},
		},
		{
			icon: "logout",
			title: "Log out",
			hoverColor: "red-200",
			fn: logout,
		},
		{
			icon: "database",
			title: "Request your data",
			fn: () => {},
		},
		{
			icon: "delete",
			title: "Delete account",
			hoverColor: "red-300",
			fn: () => {},
		}
	];

	const handleWheel = (e: any): void => {
		e.preventDefault();
		e.currentTarget.scrollBy({ left: e.deltaY, behavior: "smooth" });
	};

	const CAROUSEL_GUTTER_CLASSES = "absolute z-50 top-0 h-full w-6";

	let showMore = false;

	const ACCOUNT_SETTING_LIMIT = 4;
</script>

<div
	transition:fade={{ duration: 100 }}
	class="relative flex w-96 flex-col gap-4 overflow-hidden rounded-md border-[1px] border-gray-300 bg-offwhite py-6 shadow-md transition"
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
			{#if i + 1 < ACCOUNT_SETTING_LIMIT || showMore}
				<button
					on:click={accountSetting.fn}
					transition:slide|local={{ duration: 200 }}
					class="flex w-full cursor-pointer gap-2 px-6 py-3 active:bg-gray-300 transition hover:bg-{accountSetting.hoverColor || 'gray-300'}"
				>
					<Icon name={accountSetting.icon} outlined size="lg" />
					<span class="text overflow-hidden text-ellipsis whitespace-nowrap text-sm"
						>{accountSetting.title}</span
					>
				</button>
			{/if}
		{/each}

		{#if ACCOUNT_SETTINGS.length > ACCOUNT_SETTING_LIMIT}
			<button
				on:click={() => (showMore = !showMore)}
				class="w-fit px-6 py-2 text-xs text-sky-600 hover:underline active:opacity-80"
			>
				Show {showMore ? "less" : "more"}
			</button>
		{/if}
	</div>

	<span class="separator-h" />

	<span class="text px-6 text-sm font-semibold">Quick Actions</span>

	<div class="relative flex flex-col gap-3">
		<div class="{CAROUSEL_GUTTER_CLASSES} left-0 bg-gradient-to-r from-offwhite to-transparent" />
		<div
			class="s flex w-full snap-x snap-proximity gap-3 overflow-y-visible overflow-x-scroll px-6 pb-3"
			on:wheel={handleWheel}
		>
			{#each QUICK_ACTIONS as quickAction}
				<button
					on:click={quickAction.fn}
					class="flex h-24 w-24 flex-shrink-0 cursor-pointer snap-center flex-col items-center justify-center gap-2 rounded-md bg-white shadow-md transition hover:bg-violet-500 hover:text-offwhite active:scale-95"
				>
					<Icon name={quickAction.icon} customSize="2rem" />
					<span class="text overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium">{quickAction.title}</span>
				</button>
			{/each}
		</div>
		<div class="{CAROUSEL_GUTTER_CLASSES} right-0 bg-gradient-to-l from-offwhite to-transparent" />
	</div>
</div>
