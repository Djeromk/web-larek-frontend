import { ISuccess } from '../types';
import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _description: HTMLElement;
	protected _close: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}
	set description(total: number) {
		this._description.textContent = `Списано ${total} синапсов`;
	}
}
