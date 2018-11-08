//the item object that appears on the cart
export interface CartItem {
    order_id: number,
    item_id: number,
    quantity: number,
    item_name: string,
    item_price: number,
    item_image: string
}
