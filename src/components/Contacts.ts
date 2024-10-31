import { Form } from './base/Form';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IContacts } from '../types';


export class Contacts extends Form<IContacts> {
	protected submit: HTMLButtonElement;
	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.submit = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);

		this.container.addEventListener('input', (event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit('contacts:input', { field, value });
		});
	}
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set submitButton(value: boolean) {
		this.submit.disabled = !value;
	}

	set loadingButton(value: boolean) {
		this.submit.textContent = value ? 'Загрузка...' : 'Оплатить';
	}
}
