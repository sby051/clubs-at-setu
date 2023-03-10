<script lang="ts">
	import { isEmailUsed, signUp } from "@fb/auth";
	import { uploadFile } from "@fb/storage";
	import { windowTitle } from "@stores/globals";
	import { Button, TextInput, PasswordInput, Icon, IconButton, ImagePicker, Loader } from "@components";
	import type { StudentID, User } from "@types";
	import { REGEXES } from "@utils/constants";
	import { scale, slide } from "svelte/transition";
	import { goto } from "$app/navigation";
	import { blur } from "svelte/transition";
	import { confirm } from "@features/confirm";
	import type { Snapshot } from "./$types";

	const enum STAGES {
		DETAILS,
		MEDICAL,
		FINISHED,
	}

	const STAGE_NAMES = ["Details", "Medical", "Finished"];
	const FORM_GROUP_SECTION = "flex flex-col sm:flex-row w-full gap-2";

	const handleSubmit = async () => {
		switch (currentStage) {
			case STAGES.DETAILS:
				const emailIsUsed = await isEmailUsed(data.email);
				if (emailIsUsed) {
					const goToSignIn = await confirm("This email is already in use. Do you want to signIn?", {
						message: "Email: " + data.email,
						icon: "signIn",
						buttons: {
							confirm: {
								text: "Go to signIn",
								style: "primary",
								icon: "arrow_right",
							},
							cancel: {
								text: "Nevermind",
								style: "outlined:normal",
								icon: "close",
							},
						},
					});
					if (goToSignIn) await goto(`/sign/in?email=${data.email}`);
					return;
				}

				currentStage++;
				break;
			case STAGES.MEDICAL:
				currentStage++;
				loading.on();

				const signUpResult = await signUp(data);

				if (!signUpResult) {
					alert("An error occurred");
					return;
				}

				loading.off();

				setTimeout(async () => await goto("/"), 1000);

				break;
		}
	};

	const handleBack = () => {
		if (currentStage > 0) currentStage--;
	};

	const handleRemoveCondition = (i: number) => {
		data.medicalInfo.conditions.splice(i, 1);
		data = data;
	};

	const handlePhotoPick = async (e: CustomEvent<{ url: string; file: File }>) => {
		const { file } = e.detail;
		const path = `photos/${data.studentId}.${file.type.split("/")[1]}`;
		loading = true;
		await uploadFile(path, file);
		loading = false;
		data.photo = path;
	};

	let data: User = {
		id: "",
		studentId: "" as StudentID,
		firstName: "",
		lastName: "",
		email: "",
		clubs: [],
		password: "",
		phoneNumber: "",
		dateOfBirth: 0,
		medicalInfo: {
			doctor: {
				name: "",
				phoneNumber: "",
			},
			nextOfKin: {
				name: "",
				phoneNumber: "",
			},
			conditions: [],
		},
		photo: "",
	};
	let currentStage = STAGES.DETAILS;
	const loading = toggle();
	let dob = 0;

	$: data.email = data.studentId ? `${data.studentId}@itcarlow.ie` : "";
	$: data.studentId = data.studentId?.toUpperCase() as StudentID;
	$: data.dateOfBirth = dob;

	export const snapshot: Snapshot<User> = {
		capture: () => data,
		restore: (snapshot) => {
			console.log(snapshot);
			data = snapshot;
		},
	};

	$windowTitle = "Sign up";
</script>

<span class="text text-2xl font-bold">Sign up</span>

<form
	class="min-w-96 raised-card relative flex h-fit max-h-[80%] max-w-lg flex-col gap-5 overflow-y-auto overflow-x-hidden"
	on:submit|preventDefault={handleSubmit}
>
	{#if $loading}
		<div
			transition:blur
			class="flex-center-column absolute top-0 left-0 z-50 h-full w-full gap-2 bg-gray-200 bg-opacity-5 backdrop-blur-lg"
		>
			<span class="text text-center text-sm text-gray-500"> Doing important things... </span>
		</div>
	{/if}

	<div class="flex w-full items-center gap-0.5">
		{#each STAGE_NAMES as stage, i}
			{@const active = i === currentStage}
			{@const completed = i < currentStage}
			{#if i > 0}
				<Icon name="chevron_right" color="gray-400" />
			{/if}
			<button
				class:text-green-600={completed}
				class:text-violet-500={active}
				on:click={() => (currentStage = i)}
				disabled={i > currentStage}
				type="button"
				class="text text-xs font-medium text-gray-400 disabled:cursor-not-allowed disabled:text-gray-200 [&:not(:disabled)]:cursor-pointer [&:not(:disabled)]:hover:text-violet-500"
				>{stage}</button
			>
			{#if completed}
				<Icon name="check_circle" color="green-600" outlined />
			{/if}
		{/each}
	</div>

	{#if currentStage === STAGES.DETAILS}
		<section class={FORM_GROUP_SECTION}>
			<TextInput required placeholder="John" label="First name" bind:value={data.firstName} />
			<TextInput required placeholder="Doe" label="Last name" bind:value={data.lastName} />
		</section>

		<section class={FORM_GROUP_SECTION}>
			<TextInput
				required
				bind:value={data.studentId}
				label="Student ID"
				placeholder="C00xxxxxx"
				limit={9}
				pattern={REGEXES.STUDENT_ID}
				invalidMessage="Student ID must be in the format C00xxxxxx"
			/>

			<TextInput
				placeholder="Auto-populated"
				disabled
				bind:value={data.email}
				label="Email"
				caption="This field is auto-populated with your Student ID."
			/>
		</section>

		<section class={FORM_GROUP_SECTION}>
			<TextInput
				limit={11}
				placeholder="0871234567"
				label="Phone number"
				pattern={REGEXES.PHONE_NUMBER}
				invalidMessage="Please provide a valid Irish phone number"
				bind:value={data.phoneNumber}
			/>
			<div class="flex flex-col gap-1">
				<label for="date-of-birth" class="text text-sm font-medium text-gray-600">Date of birth</label>
				<input required bind:value={dob} id="date-of-birth" type="date" class="outlined-input" />
			</div>
		</section>
		<PasswordInput usePattern bind:value={data.password} />
	{:else if currentStage === STAGES.MEDICAL}
		<div class="block">
			<span class="text text-xl font-medium">Medical information</span>
			<span class="text mt-2 text-sm text-gray-500">
				Due to the nature of joining a club, we require some medical information. This information is used to
				contact your doctor and next of kin in case of an emergency. All data is stored securely and is not
				shared with any third parties. To learn more about how we use your data, please read our
				<a href="/privacy-policy" class="link text-sm">privacy policy</a>
			</span>
		</div>

		<section class="flex h-72 w-full gap-4">
			<div class="flex w-full flex-col gap-2">
				<span class="text flex items-center gap-1.5 font-medium text-gray-500">
					<Icon name="photo" />
					Your photo *
				</span>

				<ImagePicker on:picked={handlePhotoPick} />
			</div>

			<div class="flex w-full flex-col gap-2">
				<span class="text flex items-center gap-1.5 font-medium text-gray-700">
					<Icon name="conditions" />
					Conditions
				</span>

				<span class="text text-xs text-gray-500">Please list any medical conditions you have.</span>

				<div class="flex h-48 flex-col gap-1 overflow-y-auto">
					{#each data.medicalInfo.conditions as condition, i}
						<div class="flex w-full items-center gap-2" transition:slide|local={{ duration: 200 }}>
							<TextInput bind:value={condition} placeholder="E.g. Asthma" />
							<IconButton icon="close" on:click={() => handleRemoveCondition(i)} />
						</div>
					{/each}
				</div>

				<Button
					style="outlined:normal"
					size="sm"
					on:click={() => (data.medicalInfo.conditions = [...data.medicalInfo.conditions, ""])}
				>
					<Icon name="add" />
					Add condition
				</Button>
			</div>
		</section>

		<section class="flex flex-col gap-2">
			<span class="text flex items-center gap-1.5 font-medium text-gray-500">
				<Icon name="stethoscope" />
				Your doctor
			</span>

			<div class="flex w-full items-center gap-2">
				<TextInput required placeholder="John Doe" label="Name" bind:value={data.medicalInfo.doctor.name} />
				<TextInput
					required
					limit={11}
					placeholder="0871234567"
					label="Phone number"
					pattern={REGEXES.PHONE_NUMBER}
					invalidMessage="Please provide a valid Irish phone number"
					bind:value={data.medicalInfo.doctor.phoneNumber}
				/>
			</div>
		</section>

		<section class="flex flex-col gap-2">
			<span class="text flex items-center gap-1.5 font-medium text-gray-500">
				<Icon name="deceased" />
				Your next of kin
			</span>

			<div class="flex w-full items-center gap-2">
				<TextInput required placeholder="John Doe" label="Name" bind:value={data.medicalInfo.nextOfKin.name} />
				<TextInput
					required
					limit={11}
					placeholder="0871234567"
					label="Phone number"
					pattern={REGEXES.PHONE_NUMBER}
					invalidMessage="Please provide a valid Irish phone number"
					bind:value={data.medicalInfo.nextOfKin.phoneNumber}
				/>
			</div>
		</section>

		<span class="text text-xs text-gray-500">
			By clicking continue, you agree to our <a class="link" href="/terms">Terms of Service</a> and
			<a class="link" href="/privacy">Privacy Policy</a>.
		</span>
	{:else if currentStage === STAGES.FINISHED}
		<div class="flex-center-column h-full gap-2" in:scale>
			<Icon name="check_circle" customSize="8rem" color="green-500" />
			<span class="text text-xl font-medium">You're all set!</span>
			<span class="text w-96 text-center text-sm text-gray-500">
				You've successfully created your account. You can now use Clubs @ SETU!
			</span>
		</div>
	{/if}

	<div class="flex w-full items-center gap-2">
		{#if currentStage > STAGES.DETAILS && currentStage < STAGES.FINISHED}
			<Button fillWidth style="outlined:normal" on:click={handleBack}>
				<Icon name="keyboard_backspace" />
				Back
			</Button>
		{/if}
		{#if currentStage < STAGES.FINISHED}
			<Button type="submit" style="primary" fillWidth loading={$loading}>
				Continue
				<Icon name="arrow_forward" />
			</Button>
		{/if}
	</div>
</form>

<a class="link" href="/sign/in">Already have an account?</a>
