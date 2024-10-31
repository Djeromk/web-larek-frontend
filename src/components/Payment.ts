import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement, ensureAllElements } from "../utils/utils";

export type TabState = {
    selected: string
};

export type TabActions = {
    onClick: (tab: string) => void
}

export class Payment extends Component<TabState> {
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLElement, actions?: TabActions) {
        super(container);

        this._buttons = ensureAllElements<HTMLButtonElement>('button[type="button"]', container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                actions?.onClick?.(button.name);
            });
        })
    }
	set selected(name: string) {
        this._buttons.forEach(button => {
            this.toggleClass(button, 'button_alt_active', button.name === name);
            this.setDisabled(button, button.name === name)
        });
    }
}
