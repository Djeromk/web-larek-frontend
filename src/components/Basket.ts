import { IProduct, IBasket, IProductBasket } from '../types';
import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _index: HTMLElement;
	protected _totalAmount: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);
		this._list = ensureElement<HTMLElement>(`.${blockName}__list`, container);
		this.button = ensureElement<HTMLButtonElement>(
			`.${blockName}__button`,
			container
		);
		this._totalAmount = ensureElement<HTMLElement>(
			`.${blockName}__price`,
			container
		);

		this.button.addEventListener('click', () => {
			this.events.emit('basket:order');
		});
	}

	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
		this.button.disabled = !items.length;
	}

	set totalAmount(value: number) {
		this._totalAmount.textContent = value.toString() + ' синапсов';
	}

	updateBasket() {
		Array.from(this._list.children).forEach((item, index) => {
			const product = (item.querySelector(
				`.${this.blockName}__item-index`
			).textContent = (index + 1).toString());
		});
	}
}

interface IBasketActions {
	onClick: (event: MouseEvent) => void;
}

export class BasketItem extends Component<IProductBasket> {
	protected _title: HTMLElement;
	protected _index: HTMLElement;
	protected _price: HTMLElement;
	protected _delete: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IBasketActions
	) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._delete = container.querySelector(`.${blockName}__button`);
		if (actions?.onClick) {
			this._delete.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number) {
		this._price.textContent = value.toString() + ' синапсов';
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}
}
