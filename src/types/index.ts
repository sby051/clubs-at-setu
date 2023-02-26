import { z } from "zod";
import { REGEXES } from "@utils/constants";

export const IDSchema = z.string();
export type ID = z.infer<typeof IDSchema>;

export const StudentIDSchema = z.string().regex(REGEXES.STUDENT_ID);
export type StudentID = z.infer<typeof StudentIDSchema>;

export const MedicalContactSchema = z.object({
	name: z.string(),
	phoneNumber: z.string(),
	email: z.string().optional(),
});
export type MedicalContact = z.infer<typeof MedicalContactSchema>;

export const MedicalInfoSchema = z.object({
	conditions: z.array(z.string()),
	doctor: MedicalContactSchema,
	nextOfKin: MedicalContactSchema,
});
export type MedicalInfo = z.infer<typeof MedicalInfoSchema>;

export const UserSchema = z.object({
	id: IDSchema,
	studentId: StudentIDSchema,
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	photo: z.string(),
	phoneNumber: z.string().regex(REGEXES.PHONE_NUMBER),
	dateOfBirth: z.number(),
	clubs: z.array(IDSchema),
	medicalInfo: MedicalInfoSchema,
	password: z.string().optional(),
	admin: z.boolean().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const ClubCategorySchema = z.union([
	z.literal("academic"),
	z.literal("arts"),
	z.literal("athletics"),
	z.literal("community"),
	z.literal("culture"),
	z.literal("faith"),
	z.literal("gaming"),
	z.literal("hobbies"),
	z.literal("media"),
	z.literal("music"),
	z.literal("politics"),
	z.literal("professional"),
	z.literal("science"),
	z.literal("service"),
	z.literal("sports"),
	z.literal("technology"),
	z.literal("other"),
]);
export type ClubCategory = z.infer<typeof ClubCategorySchema>;

export const AnnouncementSchema = z.object({
	title: z.string(),
	author: IDSchema,
	readBy: z.array(IDSchema),
	content: z.string(),
	date: z.number(),
});
export type Announcement = z.infer<typeof AnnouncementSchema>;

export const ClubSchema = z.object({
	id: IDSchema,
	name: z.string(),
	description: z.string().nullable(),
	about: z.string().nullable(),
	photo: z.string().nullable(),
	announcements: z.array(AnnouncementSchema),
	managers: z.array(IDSchema),
	members: z.array(IDSchema),
	fee: z.number(),
	categories: z.array(ClubCategorySchema),
	invites: z.array(IDSchema),
});
export type Club = z.infer<typeof ClubSchema>;

export const KeyboardShortcutSchema = z.object({
	name: z.string().optional(),
	key: z.string(),
	ctrlKey: z.boolean().optional(),
	altKey: z.boolean().optional(),
	shiftKey: z.boolean().optional(),
	action: z.function(z.tuple([]), z.undefined()),
	condition: z.boolean().optional(),
});
export type KeyboardShortcut = z.infer<typeof KeyboardShortcutSchema>;

export const CategorySchema = z.object({
	title: z.string(),
	icon: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const NavigationLinkSchema = CategorySchema.extend(
	z.object({
		href: z.string(),
	})
);
export type NavigationLink = z.infer<typeof NavigationLinkSchema>;
