import { Model } from './base/Model';
import {
	IAppState,
	IOrder,
	IProduct,
	TOrderData,
} from '../types';
import { CDN_URL } from '../utils/constants';

export class AppData extends Model<IAppState> {
	catalog: IProduct[] = [];
	order: Partial<IOrder> = {};
	formErrors: Partial<TOrderData> = {};

	setCatalog(items: IProduct[]): void {
		this.catalog = items.map((item) => ({
			...item,
			selected: false,
			image: CDN_URL + item.image,
		}));
		this.events.emit('items:changed', this.catalog);
	}

	getBasketCount(): number {
		return this.catalog.filter((item) => item.selected).length;
	}

	addToBasket(item: IProduct): void {
		item.selected = true;
	}

	removeFromBasket(id: string): void {
		const item = this.catalog.find((item) => item.id === id);
		if (item) {
			item.selected = false;
		}
		this.events.emit('basket:changed', this.catalog);
	}

	getTotalAmount(): number {
		return this.catalog
			.filter((item) => item.selected)
			.reduce((acc, item) => acc + item.price, 0);
	}

	setPaymentData(data: Partial<IOrder>): void {
		this.order.payment = data.payment;
		this.events.emit('order:changed', this.order);
	}

	setAddress(field: string, value: string): void {
		if (field === 'address') this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:complete', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:address', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:contact', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderItems(): void {
		this.order.items = this.catalog
			.filter((item) => item.selected)
			.map((item) => item.id);
	}

	setContacts(field: string, value: string): void {
		if (field === 'email') this.order[field] = value;
		else if (field === 'phone') this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit('contacts:complete', this.order);
		}
	}

	clearCart(): void {
		this.catalog.forEach((item) => (item.selected = false));
	}

	clearOrder(): void {
		this.order = {};
		this.clearCart();
	}
}
