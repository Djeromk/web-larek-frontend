// Модели приложения
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

// интерфейс товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// интерфейс заказа
export interface IOrder {
	paymentMethod: 'cash' | 'online';
	email: string;
	phone: string;
	address: string;
	totalAmount: number | string;
	items: IProduct[];
}

//тип для корзины
export type TProductCart = Pick<IProduct, 'title' | 'price'>;
//тип для оформления заказа
export type TOrder = Pick<IOrder, 'paymentMethod' | 'address'>;
// тип для контактов
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;
// тип для презентера
export type TOrderData = TOrder & TOrderContactInfo;

// интерфейс корзины
export interface ICart {
	cartItems: IProduct[];
	addItem(product: IProduct): void;
	removeItem(productId: string): void;
	getItems(): IProduct[];
	getTotalAmount(): number;
	clearCart(): void;
}

// интерфейс API
export interface IProductApi {
	getProducts: () => Promise<ApiListResponse<IProduct>>;
}

// интерфейс модального окна
export interface IModal {
	open(content: string): void;
	close(): void;
	setContent(content: string): void;
}

export class Modal implements IModal {
	container: HTMLElement;
	closeButton: HTMLElement;
	content: HTMLElement;
	currentModal: AppStateModals | null = null;

	open: (modal: AppStateModals) => void;
	close: () => void;
	setContent: (content: string) => void;
	getCurrentModal: () => AppStateModals | null;
}
export class Cart implements ICart {
	cartItems: IProduct[] = [];
	constructor() {}
	addItem(product: IProduct): void {}
	removeItem(productId: string): void {}
	getItems(): IProduct[] {
		return [];
	}
	getTotalAmount(): number {
		return 0;
	}
	clearCart(): void {}
}

export class ProductApi implements IProductApi {
	getProducts: () => Promise<ApiListResponse<IProduct>>;
}

// класс создания заказа
export class Order {
	createOrder(
		paymentMethod: 'cash' | 'online',
		email: string,
		phone: string,
		address: string,
		totalAmount: number | string,
		items: IProduct[]
	): IOrder {
		const order: IOrder = {
			paymentMethod,
			email,
			phone,
			address,
			totalAmount,
			items,
		};
		return order;
	}
}

export interface IAppState {
	catalog: IProduct[];
	cart: ICart;
	preview: IProduct | null;
	order: Partial<IOrder>;
	setCatalog(items: IProduct[]): void;
	setPreview(item: IProduct): void;
	clearPreview(): void;
	setOrder(order: Partial<IOrder>): void;
	clearOrder(): void;
}

// Presenter

// класс презентера
export class ShopPresenter {
	loadProducts(): void {}
	openProductModal(product: IProduct): void {}
	openBasketModal(): void {}
	addToCart(product: IProduct): void {}
	removeFromCart(productId: string): void {}
	postOrder(order: IOrder): void {}
	checkValidation(): boolean {
		return false;
	}
	clearCart(): void {}
}

//View

// интерфейс IView
export interface IView {
	showCatalog(products: IProduct[]): void;
	showProductModal(product: IProduct): void;
	showBasketModal(): void;
	showOrderModal(order: IOrder): void;
	showContactsModal(): void;
	showSuccessModal(): void;
	showError(): void;
}

export enum AppStateModals {
	product = 'modal:product',
	basket = 'modal:basket',
	order = 'modal:order',
	contacts = 'modal:contacts',
	success = 'modal:success',
	none = 'modal:none',
}
