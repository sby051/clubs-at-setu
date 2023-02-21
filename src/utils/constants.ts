export const REGEXES: Record<string, RegExp> = {
	STUDENT_ID: /^[cC]00\d{6}$/i,
	STUDENT_EMAIL: /^[cC]00\d{6}@itcarlow.ie$/i,
	NAME: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/i,
	PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/, // Minimum eight characters, at least one uppercase, lowercase, numeric and special character
	PHONE_NUMBER: /^(\+\d{1,3}[- ]?)?\d{10}$/,
};
