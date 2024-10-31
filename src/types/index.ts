import { Api } from '../components/base/api';

// интерфейс товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	selected: boolean;
}

// интерфейс заказа
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number | string;
	items: string[];
}

export type TOrderResponse = Pick<IOrder, 'items' | 'total'>;
//тип для создания массива заказа
export type TOrderItem = Pick<IProduct, 'id'>;
//тип для корзины
export type TProductCart = Pick<IProduct, 'title' | 'price'>;
//тип для оформления заказа
export type TOrder = Pick<IOrder, 'payment' | 'address'>;
// тип для контактов
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;
// тип для презентера
export type TOrderData = TOrder & TOrderContactInfo;


export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
export interface IAppState {
	catalog: IProduct[];
	formErrors: Partial<TOrderData>;
	order: Partial<IOrder>;
}

export interface IProductCard {
	category: string;
	title: string;
	image: string;
	price: number | null;
	description: string;
	id: string;
	selected: boolean;
}

export interface IBasket {
	list: HTMLElement[];
	totalAmount: number;
}

export interface IProductBasket extends IProduct {
	index: number;
}

export interface ISuccess {
	description: string | number;
}

export type TabState = {
	selected: string;
};

export interface IOrderForm {
	address: string;
	toggleSubmit: () => void;
}

export type TabActions = {
	onClick: (tab: string) => void;
};

export interface IContacts {
	phone: string;
	email: string;
}

export enum Categores {
	'софт-скилл' = 'card__category_soft',
	'хард-скилл' = 'card__category_hard',
	'другое' = 'card__category_other',
	'дополнительное' = 'card__category_additional',
	'кнопка' = 'card__category_button',
}

export type CategoryType =
	| 'софт-скилл'
	| 'хард-скилл'
	| 'другое'
	| 'дополнительное'
	| 'кнопка';

export enum AppStateModals {
	items = 'items:changed',
	product = 'modal:product',
	basket = 'modal:basket',
	order = 'modal:order',
	contacts = 'modal:contacts',
	success = 'modal:success',
	none = 'modal:none',
}
