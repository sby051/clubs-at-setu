export interface ConfirmButton {
    text: string;
    style: string;
    icon?: string;
}

export interface ConfirmButtons {
    cancel: ConfirmButton;
    confirm: ConfirmButton;
}

export interface ConfirmOptions {
    message?: string,
    icon?: string,
    buttons?: ConfirmButtons,
    confirmationInput?: {
        placeholder: string,
        label: string,
        expectedValue: string,
    }
}

export interface ConfirmData extends ConfirmOptions {
    title: string;
}