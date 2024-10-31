import { ensureElement } from '../utils/utils';

export const successTemplate = ensureElement<HTMLTemplateElement>('#success');
export const cardCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
export const cardPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
export const cardBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
export const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
export const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
export const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
export const modalTemplate =
	ensureElement<HTMLTemplateElement>('#modal-container');
