<script lang="ts">
	import type { Chat, MessageEvent } from ".";
	import type { ID } from "@types";
	import user from "@stores/user";
	import { rtdb } from "@fb";
	import { set, update, push, ref, onChildAdded, onChildChanged, remove, onChildRemoved } from "firebase/database";
	import { onMount, tick } from "svelte";
	import ChatMessage from "./ChatMessage.svelte";
	import ChatInput from "./ChatInput.svelte";
	import { Icon } from "@components";

	export let id: ID;
	export let members: ID[];

	let chatRoom: Chat.Room = {
		id,
		members,
		messages: [],
	};
	let replyId: ID | null = "";
	let messagesEl: HTMLElement;
	$: chatIsEmpty = chatRoom.messages.filter((message) => !message.deleted).length === 0;

	const AUTHOR_NAME = `${$user?.firstName} ${$user?.lastName}`;
	const AUTHOR_ID = $user?.id;
	const ROOM_PATH = `chat_rooms/${id}/%`;
	const ROOM_REF = ref(rtdb, `chat_rooms/${id}`);

	const handleSend = (e: MessageEvent): void => {
		set(push(ROOM_REF), {
			authorId: AUTHOR_ID,
			authorName: AUTHOR_NAME,
			content: e.detail.content,
			timestamp: new Date().getTime(),
			replyTo: replyId,
		});
		replyId = "";
	};

	const handleReplyToMessage = (e?: MessageEvent): void => {
		if (!e) {
			replyId = null;
			return;
		}
		replyId = e.detail.messageId;
	};

	const handleDeleteMessage = (e: MessageEvent): void => {
		remove(ref(rtdb, ROOM_PATH.replace("%", e.detail.messageId)));
	};

	const handleEditMessage = (e: MessageEvent): void => {
		update(ref(rtdb, ROOM_PATH.replace("%", e.detail.messageId)), {
			content: e.detail.content,
			edited: true,
		});
	};

	const scrollToBottom = () => {
		if (!messagesEl) return;
		messagesEl.scrollTop = messagesEl?.scrollHeight;
	};

	onMount(() => {
		onChildAdded(ROOM_REF, async (snapshot) => {
			chatRoom.messages = [...chatRoom.messages, { id: snapshot.key, ...snapshot.val() }];
			await tick();
			scrollToBottom();
		});

		onChildChanged(ROOM_REF, (snapshot) => {
			chatRoom.messages[chatRoom.messages.findIndex((value: Chat.Message) => value.id === snapshot.key)] =
				snapshot.val();
		});

		onChildRemoved(ROOM_REF, async (snapshot) => {
			chatRoom.messages = chatRoom.messages.filter((value: Chat.Message) => value.id !== snapshot.key);
		});
	});
</script>

<div bind:this={messagesEl} class="h-full" aria-label="Chat room {id}">
	{#if chatIsEmpty}
		<Icon name="forum" className="opacity-10" customSize="11rem" />
	{:else}
		<div class="scroll-y flex h-full flex-col gap-0.5 py-5">
			{#each chatRoom.messages as message}
				<ChatMessage
					{message}
					on:reply={handleReplyToMessage}
					on:delete={handleDeleteMessage}
					on:edit={handleEditMessage}
				/>
			{/each}
		</div>
	{/if}

	<div aria-label="Chat input">
		{#if replyId}
			{@const replyMessage = chatRoom.messages.filter((message) => message.id === replyId)[0]}
			<div class="mb-2 flex w-full items-center gap-2 rounded-md bg-blue-200 p-2">
				<Icon name="reply" color="text-gray-500" size="lg" />
				<span class="text w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500">
					<b>{replyMessage.authorName}</b>: {replyMessage.content}
				</span>
				<button class="text ml-auto font-medium" on:click={() => handleReplyToMessage()}>
					<Icon name="close" color="text-gray-500" size="lg" />
				</button>
			</div>
		{/if}

		<ChatInput on:send={handleSend} />
	</div>
</div>
