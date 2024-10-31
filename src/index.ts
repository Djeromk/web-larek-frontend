import './scss/styles.scss';
import { IProduct, TOrder, TOrderData, TOrderResponse } from './types/index';
import { CatalogItem, ProductCardPreview } from './components/ProductCard';
import {
	successTemplate,
	cardCatalogTemplate,
	cardPreviewTemplate,
	cardBasketTemplate,
	basketTemplate,
	orderTemplate,
	contactsTemplate,
	modalTemplate,
} from './utils/templates';
import { Basket, BasketItem } from './components/Basket';
import { cloneTemplate } from './utils/utils';
import { AppData } from './components/AppData';
import { Page } from './components/Page';
import { Api, ApiListResponse } from './components/base/api';
import { Modal } from './components/base/Modal';
import { EventEmitter } from './components/base/events';
import { API_URL } from './utils/constants';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const events = new EventEmitter();
const page = new Page(document.body, events);
const api = new Api(API_URL);
const appData = new AppData({}, events);

const modal = new Modal(modalTemplate, events);
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

api
	.get('/product/')
	.then((data: ApiListResponse<IProduct>) => appData.setCatalog(data.items));

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const product = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:select', (item: IProduct) => {
	const product = new ProductCardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('basket:add', item),
	});
	modal.render({
		content: product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
			selected: item.selected,
		}),
	});
});

events.on('basket:add', (item: IProduct) => {
	item.selected = true;
	appData.addToBasket(item);
	page.counter = appData.getBasketCount();
	modal.close();
});

events.on('basket:open', () => {
	const basketList = appData.catalog
		.filter((item) => item.selected)
		.map((item, index) => {
			const basketItem = new BasketItem(
				'card',
				cloneTemplate(cardBasketTemplate),
				{
					onClick: (event: MouseEvent) => events.emit('basket:remove', item),
				}
			);
			return basketItem.render({
				index: index + 1,
				title: item.title,
				price: item.price,
			});
		});
	modal.render({
		content: basket.render({
			list: basketList,
			totalAmount: appData.getTotalAmount(),
		}),
	});
});

events.on('basket:remove', (item: IProduct) => {
	appData.removeFromBasket(item.id);
	page.counter = appData.getBasketCount();
	basket.totalAmount = appData.getTotalAmount();
	item.selected = false;
	basket.updateBasket();
	basket.list = appData.catalog
		.filter((item) => item.selected)
		.map((item, index) => {
			const basketItem = new BasketItem(
				'card',
				cloneTemplate(cardBasketTemplate),
				{
					onClick: (event: MouseEvent) => events.emit('basket:remove', item),
				}
			);
			return basketItem.render({
				index: index + 1,
				title: item.title,
				price: item.price,
			});
		});
});

events.on('basket:order', () => {
	order.clearInput();
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:togglePayment', (button: HTMLButtonElement) => {
	appData.order.payment = button.name;
});

events.on('formErrors:address', (errors: Partial<TOrder>) => {
	const { address, payment } = errors;
	order.submitButton = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

events.on(`order:addressInput`, (data: { field: string; value: string }) => {
	appData.setAddress(data.field, data.value);
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('formErrors:contact', (errors: Partial<TOrderData>) => {
	const { email, phone } = errors;
	contacts.submitButton = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:input', (data: { field: string; value: string }) => {
	appData.setContacts(data.field, data.value);
});

events.on('contacts:submit', () => {
	contacts.loadingButton = true;
	appData.order.total = appData.getTotalAmount();
	appData.setOrderItems();
	api
		.post('/order', appData.order)
		.then((response) => {
			events.emit('order:success', response);
			appData.clearOrder();
			page.counter = appData.getBasketCount();
			contacts.loadingButton = false;

		})
		.catch((error) => {
			console.log(error, 'Ошибка при создании заказа');
		});
});

events.on('order:success', (response: TOrderResponse) => {
	const success = new Success(cloneTemplate(successTemplate), {
		onClick: () => {
			events.emit('modal:close');
			modal.close();
		},
	});
	modal.render({
		content: success.render({
			description: response.total,
		}),
	});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});
