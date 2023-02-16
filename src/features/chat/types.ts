/* eslint-disable @typescript-eslint/no-namespace */
import type { EpochTimestamp, ID } from "@types";

export namespace Chat {
	export type Room = {
		id: ID;
		members: ID[];
		messages: Message[];
	};
	export type Message = {
		id: ID;
		authorId: ID;
		authorName: string;
		timestamp: EpochTimestamp;
		content: string;
		replyTo: ID | null;
		edited?: boolean;
		deleted?: boolean;
	};
}

export type MessageEvent = CustomEvent<{
	content?: string;
	messageId?: ID;
}>;
