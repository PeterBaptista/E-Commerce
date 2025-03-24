"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import React from "react";
import CartItem from "./cart-item-interface";
import { MutateOptions } from "@tanstack/react-query";

interface ShoppingCartItemProps {
  product: CartItem;
  isLoading: boolean;
  removeFn: (productId: string) => void;
  alterFn: (
    variables: {
      productId: string;
      amount: number;
    },
    options?: MutateOptions<any, Error, any, unknown> | undefined
  ) => void;
}

const ShoppingCartItem: React.FC<ShoppingCartItemProps> = ({
  product,
  isLoading,
  removeFn,
  alterFn,
}) => {
  const { id, name, price, image_url } = product.products;
  const { amount } = product;
  const [newAmount, setNewAmount] = useState<number>(amount);

  return (
    <CardContent className="p-6">
      <div className="grid gap-6">
        <div key={product.products.id} className="grid gap-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Image
                src={product.products.image_url || "/placeholder.svg"}
                alt={product.products.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
            </div>
            <div className="flex-1 grid gap-1">
              <h3 className="font-medium">{product.products.name}</h3>
              <p className="text-muted-foreground">
                R$ {product.products.price.toFixed(2).replace(".", ",")}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    if (newAmount > 1) {
                      alterFn(
                        {
                          productId: product.products.id,
                          amount: newAmount - 1,
                        },
                        { onSuccess: () => setNewAmount(newAmount - 1) }
                      );
                    }
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{newAmount}</span>
                <Button
                  disabled={isLoading}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    alterFn(
                      {
                        productId: product.products.id,
                        amount: newAmount + 1,
                      },
                      { onSuccess: () => setNewAmount(newAmount + 1) }
                    );
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-auto"
                  onClick={() => removeFn(product.products.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {
              <div className="flex items-start justify-end w-24">
                <p className="font-medium">
                  R${" "}
                  {(product.products.price * newAmount)
                    .toFixed(2)
                    .replace(".", ",")}
                </p>
              </div>
            }
          </div>
          <Separator />
        </div>
      </div>
    </CardContent>
  );
};
export default ShoppingCartItem;
