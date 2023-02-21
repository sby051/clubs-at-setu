<script lang="ts">
	import Time from "svelte-time";
	import type { Chat, MessageEvent } from "./types";
	import { Icon } from "@components";
	import { enter } from "sveltils/actions";
	import ChatInput from "./ChatInput.svelte";
	import { createEventDispatcher } from "svelte";
	import user from "@stores/user";

	export let message: Chat.Message;
	export let hasModifyPerms: boolean;
	export let chatRoom: Chat.Room;

	let editing = false;
	let hovering = false;
	let modifier = false;

	const dispatchMessageEvent = createEventDispatcher<MessageEvent>();
	const ICON_BUTTON_STYLE =
		"rounded grid place-items-center h-7 w-7 cursor-pointer hover:bg-gray-300 text-lg transition";

	const handleEdit = (e: MessageEvent) => {
		if (e.detail.content === message.content) {
			editing = false;
			return;
		}

		dispatchMessageEvent("edit", {
			messageId: message.id,
			content: e.detail.content,
		});
		editing = false;
	};

	const handleReply = (e: any) => {
		dispatchMessageEvent("reply", {
			messageId: message.id,
		});
	};

	const replyMessage = chatRoom.messages.filter((msg) => msg.id === message.replyTo)[0];
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === "Shift") {
			modifier = true;
		}
	}}
	on:keyup={(e) => {
		if (e.key === "Shift") {
			modifier = false;
		}
	}}
/>

<div
	class="relative flex w-full flex-col rounded-md py-1 px-7 [&:not(.gap-1)]:hover:bg-gray-200"
	on:mouseenter={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	class:gap-1={editing}
	class:bg-blue-200={replyMessage?.authorId === $user?.id}
	class:border-l-4={replyMessage?.authorId === $user?.id}
	class:border-blue-400={replyMessage?.authorId === $user?.id}
	aria-label="Chat message {message.id}"
>
	<div class="flex gap-2">
		<span class="text text-sm font-bold text-gray-600">
			{message.authorName}
		</span>

		<span class="text text-[10px] text-gray-600">
			at
			<Time timestamp={message.timestamp} format="h:mm A" />
		</span>

		{#if replyMessage}
			<div class="flex-center gap-2 rounded-full bg-blue-300 px-1.5 text-gray-600">
				<Icon name="reply" />
				<span class="text text-xs">
					<b>{replyMessage.authorName}</b>: {replyMessage.content}
				</span>
			</div>
		{/if}
	</div>

	{#if editing}
		<ChatInput value={message.content} on:send={handleEdit} />
		<span class="text select-none text-[9px] text-gray-400"> escape to cancel, enter to save </span>
	{:else}
		<span class="text w-full break-all text-sm">
			{message.content}
			{#if message.edited}
				<span class="text select-none text-[9px] italic text-gray-400"> &nbsp;(edited) </span>
			{/if}
		</span>
	{/if}

	{#if hovering}
		<div class="absolute top-[-13px] right-3 flex h-fit rounded-md bg-gray-200 shadow-md">
			{#if modifier || !hasModifyPerms}
				<button class={ICON_BUTTON_STYLE} on:click={handleReply}>
					<Icon name="reply" />
				</button>
			{:else if hasModifyPerms}
				<button use:enter on:enter={handleEdit} class={ICON_BUTTON_STYLE} on:click={() => (editing = !editing)}>
					<Icon name={editing ? "save" : "edit"} />
				</button>

				<button
					class={ICON_BUTTON_STYLE + " hover:bg-red-400"}
					on:click={() => dispatchMessageEvent("delete", { messageId: message.id })}
				>
					<Icon name="delete" />
				</button>
			{/if}
		</div>
	{/if}
</div>
