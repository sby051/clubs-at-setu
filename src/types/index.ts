export type ID = string;
export type StudentID = `C00${ID}` | `c00${ID}`;

export type User = {
	id: ID;
	studentId: StudentID;
	firstName: string;
	lastName: string;
	email: string;
	photo: string;
	phoneNumber: string;
	dateOfBirth: EpochTimeStamp;
	clubs: ID[];
	medicalInfo: MedicalInfo;
	password?: string;
	admin?: boolean;
};

export type MedicalInfo = {
	conditions: string[];
	doctor: MedicalContact;
	nextOfKin: MedicalContact;
};

export type MedicalContact = {
	name: string;
	phoneNumber: string;
	email?: string;
};

export type Club = {
	id: ID;
	name: string;
	description: string | null;
	about: string | null;
	photo: string | null;
	announcements: Announcement[];
	managers: ID[];
	members: ID[];
	fee: number;
	categories: ClubCategory[];
	invites: ID[];
};

type ClubCategory =
	| "academic"
	| "arts"
	| "athletics"
	| "community"
	| "culture"
	| "faith"
	| "gaming"
	| "hobbies"
	| "media"
	| "music"
	| "politics"
	| "professional"
	| "science"
	| "service"
	| "sports"
	| "technology"
	| "other";

export type Announcement = {
	title: string;
	author: ID;
	readBy: ID[];
	content: string;
	date: EpochTimeStamp;
};

export type KeyboardShortcut = {
	name?: string;
	key: string;
	ctrlKey?: boolean;
	altKey?: boolean;
	shiftKey?: boolean;
	action: VoidFunction;
	condition?: boolean;
};

export type Category = {
	title: string;
	icon: string;
};

export type NavigationLink = {
	href: string;
} & Category;
