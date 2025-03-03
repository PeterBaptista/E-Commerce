// Arquivo: /product-order-history/components/product-order-card.tsx
"use client";
import React from "react";

interface ProductOrderCardProps {
  id: string;
  createdAt: string;
  productId: string;
  pricePaid: string;
  amount: number;
  productName: string;
  imageUrl: string;
}

const ProductOrderCard: React.FC<ProductOrderCardProps> = ({
  id,
  createdAt,
  productId,
  pricePaid,
  amount,
  productName,
  imageUrl
}) => {
  return (
    <div className="bg-white border border-gray-300 p-4 m-2 rounded-lg flex items-center gap-4 shadow-sm">
      {/* Imagem do Produto */}
      <img
        src={imageUrl}
        alt={productName}
        className="w-20 h-20 object-cover rounded-md"
      />
  
      {/* Detalhes do Produto */}
      <div>
        <h3 className="mb-2 text-lg font-medium text-gray-800">{productName}</h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Coluna 1 */}
          <div>
            <p className="text-sm text-gray-600">Item ID: {id}</p>
            <p className="text-sm text-gray-600">
              Date: {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
  
          {/* Coluna 2 */}
          <div>
            <p className="text-sm text-gray-600">
              Price: R$ {Number(pricePaid).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Quantity: {amount}</p>
          </div>
  
          {/* Coluna 3 */}
          <div>
            <p className="text-sm text-gray-600">Product ID: {productId}</p>
            <p className="text-sm text-gray-600">Created At: {createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderCard;