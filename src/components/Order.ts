import { Form } from './base/Form';
import { IEvents } from './base/events';
import { ensureAllElements, ensureElement } from '../utils/utils';
import { TabActions, IOrderForm } from '../types';


export class Order extends Form<IOrderForm> {
	protected _address: HTMLInputElement;
	protected _buttons: HTMLButtonElement[];
	protected submit: HTMLButtonElement;
	protected payment: string;

	constructor(
		container: HTMLFormElement,
		protected events: IEvents,
		actions?: TabActions
	) {
		super(container, events);

		this.submit = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);

		this._buttons = ensureAllElements<HTMLButtonElement>(
			'button[type="button"]',
			container
		);
		this._address = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			container
		);

		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.selected = button.name;
				events.emit('order:togglePayment', button);
			});
			this.container.addEventListener('input', (event) => {
				const target = event.target as HTMLInputElement;
				const field = target.name;
				const value = target.value;
				this.events.emit('order:addressInput', { field, value });
			});
		});
	}
	set submitButton(value: boolean) {
		this.submit.disabled = !value;
	}

	clearInput() {
		this._address.value = '';
		this.selected = null;
	}

	set selected(name: string) {
		this._buttons.forEach((button) => {
			button.classList.toggle('button_alt-active', button.name === name);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
