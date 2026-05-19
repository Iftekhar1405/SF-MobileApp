import type { CartItem, Order, User } from '@/types/models';
import { isPopulatedProduct } from '@/utils/cartLines';
import { formatCurrencyINR } from '@/utils/formatCurrency';
import { getWebAppUrl } from '@/utils/openWhatsApp';

type LineItem = CartItem;

function formatItemSets(itemSet: LineItem['itemSet']): string {
  if (!itemSet?.length) return '';
  return itemSet
    .map((set) => `    - Size: ${set.size}, Pairs: ${set.lengths}`)
    .join('\n');
}

function formatLineItem(item: LineItem, index: number): string {
  const product = isPopulatedProduct(item.productId) ? item.productId : null;
  const brand = product?.brand ?? 'N/A';
  const article = product?.article ?? 'N/A';
  const category = product?.category ?? '';
  const sets = formatItemSets(item.itemSet);

  return `Item ${index + 1}:
  • Brand: ${brand}
  • Article: ${article}${category ? `\n  • Category: ${category}` : ''}
  • Color: ${item.color}
  • Quantity: ${item.quantity} carton(s)${sets ? `\n  • Sizes:\n${sets}` : ''}`;
}

function resolveCustomer(order: Order, profile?: User | null) {
  const u =
    order.userId && typeof order.userId === 'object'
      ? (order.userId as User)
      : profile;
  return {
    name: u?.name ?? 'Customer',
    shopName: u?.shopName ?? '',
    phone: u?.phone ?? '',
  };
}

export function buildAdminOrderUrl(orderId: string): string {
  const base = getWebAppUrl();
  return `${base}/pending-orders?orderId=${encodeURIComponent(orderId)}`;
}

export function buildOrderWhatsAppMessage(params: {
  order: Order;
  profile?: User | null;
  notes?: string;
}): string {
  const { order, profile, notes } = params;
  const customer = resolveCustomer(order, profile);
  const items = order.items ?? [];

  const itemDetails = items
    .map((item, index) => formatLineItem(item, index))
    .join('\n\n');

  const customerLine = customer.shopName
    ? `${customer.shopName} (${customer.name})`
    : customer.name;

  const notesBlock =
    notes && notes.trim()
      ? `\n\n📝 *Notes:*\n${notes.trim()}`
      : '';

  const deliveryBlock = order.deliveryAddress
    ? `\n\n📍 *Delivery:*\n${order.deliveryAddress}${
        order.pincode ? `\nPincode: ${order.pincode}` : ''
      }${order.landmark ? `\nLandmark: ${order.landmark}` : ''}`
    : '';

  return `🛒 *New Order Placed!*

👤 *Customer:* ${customerLine}
📞 *Phone:* ${customer.phone || 'N/A'}

📦 *Items:*
${itemDetails || '(No items)'}

💰 *Order total:* ${formatCurrencyINR(order.totalPrice)}
📊 *Total cartons:* ${order.totalItems}${deliveryBlock}${notesBlock}

🆔 *Order ID:* \`${order._id}\`

🔗 *Admin order:* ${buildAdminOrderUrl(order._id)}

Please proceed to process the order. ✅`;
}
