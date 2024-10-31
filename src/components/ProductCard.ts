import { Categores, CategoryType, IProductCard } from '../types/index';
import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class ProductCard extends Component<IProductCard> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this.button = container.querySelector(`.${blockName}__button`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);
		if (actions?.onClick) {
			if (this.button) {
				this.button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this._image.src = value;
	}

	set category(value: CategoryType) {
		this._category.textContent = value;
		this._category.classList.add(Categores[value]);
	}

	set price(value: number | null) {
		if (value) this._price.textContent = value.toString() + ' синапсов';
		else {
			this._price.textContent = 'Бесценно';
			this.setDisabled(this.button, true);
		}
	}

	set selected(value: boolean) {
		if (!this.button.disabled) {
			this.button.disabled = value;
		}
	}
}

export class CatalogItem extends ProductCard {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}
}

export class ProductCardPreview extends ProductCard {
	protected _text: HTMLElement;
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._text = ensureElement<HTMLElement>(
			`.${this.blockName}__text`,
			container
		);
	}

	set description(value: string) {
		this._text.textContent = value;
	}
}
