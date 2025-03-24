interface CartItem {
    products: {
        id: string;
        name: string;
        price: number;
        image_url: string;
        stock_quantity: number;
        is_active: boolean;
    };
    amount: number;
}
export default CartItem;