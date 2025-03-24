import React, { useState }from 'react';
import { axiosApi } from "@/lib/axios-client"
import CarrinhoDeCompras from './components/shopping-cart'
import CartItem from "./components/cart-item-interface";

const ShoppingCart: React.FC = () => {


    return (
        <main className="container mx-auto py-10 px-4">
          <CarrinhoDeCompras />
        </main>
    );
}

export default ShoppingCart;