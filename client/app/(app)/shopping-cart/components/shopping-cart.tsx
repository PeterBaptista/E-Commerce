"use client";

import ShoppingCartItem from "./shopping-cart-card";
import { useQueries, useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/providers/tanstack-query-provider";

import type React from "react";

import { useState } from "react";
import axios, { Axios } from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  PlusIcon,
} from "lucide-react";
import placeholder from "../../../public/placeholder.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosApi } from "@/lib/axios-client";
import SelecionarCartao, {
  CardAPI,
  CardSelectedType,
  cardType,
} from "./selecionarCartao";
import AdicionarCartao from "./adicionarCartao";
import CartItem from "./cart-item-interface";

export default function CarrinhoDeCompras() {
  const [metodoPagamento, setMetodoPagamento] = useState<"cartao" | "pix">(
    "cartao"
  );
  const [couponName, setCouponName] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponName(e.target.value);
  };

  const {
    data: cartProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shopping-cart-products"],
    queryFn: async (): Promise<CartItem[]> => {
      const response = await axiosApi.get(`/shopping-cart/`);
      return response.data;
    },
  });

  // Função para remover um produto do carrinho
  const removeItemMutate = useMutation({
    mutationFn: async (productId: string) => {
      await axiosApi.delete(`/shopping-cart/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping-cart-products"],
      });
    },
  });

  // Função para atualizar a quantidade de um produto
  const alterItemMutate = useMutation({
    mutationFn: async ({
      productId,
      amount,
    }: {
      productId: string;
      amount: number;
    }) => {
      await axiosApi.put(`/shopping-cart/`, { id: productId, amount: amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping-cart-products"],
      });
    },
  });

  // Função para limpar o carrinho
  const emptyCartMutate = useMutation({
    mutationFn: async () => {
      await axiosApi.delete(`/shopping-cart/`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping-cart-products"],
      });
    },
  });

  const finalizarCompraMutate = useMutation({
    mutationFn: async (values: any) => {
      const response = await axiosApi.post("/order-history", values);
      return response.data;
    },
  });

  const postProdutoComprado = useMutation({
    mutationFn: async (values: any) => {
      await axiosApi.post("/product-order-history", values);
    },
  });

  function finalizarCompra() {
    const diamesano = new Date().toISOString().slice(0, 10);

    const requestBody = {
      order_data: diamesano,
      destination: "Rua dos Bobos, 0",
      status: "pending",
      total_value: total.toFixed(2),
    };

    finalizarCompraMutate.mutate(requestBody, {
      onSuccess: (data: any) => {
        console.log(data);

        cartProducts.map((cartItem) => {
          const productOrderHistory = {
            order_id: data.order_id,
            product_id: cartItem.products.id,
            price_paid: cartItem.products.price,
            amount: cartItem.amount,
          };
          postProdutoComprado.mutate(productOrderHistory);
        });

        emptyCartMutate.mutate();
        queryClient.invalidateQueries({
          queryKey: ["shopping-cart-products"],
        });
      },
    });
  }

  // Cálculos do carrinho
  const { data: cupons = [] } = useQuery({
    queryKey: ["cupom"],
    queryFn: async () => {
      const response = await axiosApi(`/coupons`);
      return response.data;
    },
  });

  function couponTest() {
    console.log(cupons);

    const cupom = cupons.find((c: any) => c.codename === couponName);
    if (cupom) {
      setDiscount(cupom.percentage);
    } else {
      setDiscount(0);
    }
  }

  const subtotal =
    cartProducts?.reduce(
      (total, product) => total + product.products.price * product.amount,
      0
    ) ?? 0;
  const frete = subtotal > 300 ? 0 : 19.9;
  const total = subtotal - subtotal * (discount / 100) + frete;
  const discount_ammount = subtotal * (discount / 100);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Meu Carrinho</h1>
      </div>
      {cartProducts.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Seu carrinho está vazio</h2>
          <p className="text-muted-foreground mb-6">
            Adicione produtos ao seu carrinho para continuar comprando
          </p>
          <Button asChild>
            <Link href="/">Continuar Comprando</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              {cartProducts.map((cartItem) => (
                <ShoppingCartItem
                  key={cartItem.products.id}
                  product={cartItem}
                  removeFn={removeItemMutate.mutate}
                  alterFn={alterItemMutate.mutate}
                  isLoading={
                    removeItemMutate.isPending || alterItemMutate.isPending
                  }
                />
              ))}
              <CardFooter className="flex justify-between p-6">
                <Button variant="outline" asChild>
                  <Link href="/">Continuar Comprando</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => emptyCartMutate.mutate()}
                >
                  Limpar Carrinho
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>
                      {frete === 0
                        ? "Grátis"
                        : `R$ ${frete.toFixed(2).replace(".", ",")}`}
                    </span>
                  </div>
                  {frete === 0 && (
                    <div className="text-sm text-green-600">
                      Frete grátis para compras acima de R$ 300,00
                    </div>
                  )}

                  <div className="mt-4 space-y-3">
                    <Tabs
                      defaultValue="cartao"
                      className="w-full"
                      onValueChange={(value) =>
                        setMetodoPagamento(value as "cartao" | "pix")
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="cartao">Cartão</TabsTrigger>
                        <TabsTrigger value="pix">PIX</TabsTrigger>
                      </TabsList>
                      <TabsContent value="cartao" className="space-y-3 mt-3">
                        <SelecionarCartao />

                        <AdicionarCartao />
                      </TabsContent>
                      <TabsContent value="pix" className="space-y-4 mt-3">
                        <div className="border rounded-md p-4 text-center">
                          <div className="mb-4">
                            <Image
                              src="/placeholder.svg?height=150&width=150"
                              alt="QR Code PIX"
                              width={150}
                              height={150}
                              className="mx-auto"
                            />
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Escaneie o QR Code acima com o aplicativo do seu
                            banco
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                              <span className="text-sm font-medium">
                                Código PIX:
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                                  00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-copy"
                                  >
                                    <rect
                                      width="14"
                                      height="14"
                                      x="8"
                                      y="8"
                                      rx="2"
                                      ry="2"
                                    />
                                    <path d="M4 16c0-1.1.9-2 2-2h2" />
                                    <path d="M4 12c0-1.1.9-2 2-2h2" />
                                    <path d="M4 8c0-1.1.9-2 2-2h2" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            <Button variant="outline" className="w-full">
                              Copiar Código PIX
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            • O pagamento via PIX é processado instantaneamente
                          </p>
                          <p>
                            • Após o pagamento, você receberá a confirmação por
                            e-mail
                          </p>
                          <p>• O código PIX expira em 30 minutos</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Input
                      className="w-full"
                      placeholder="Cupom de desconto"
                      onChange={handleChange}
                    />
                    <Button variant="outline" onClick={couponTest}>
                      Aplicar
                    </Button>
                  </div>

                  {discount != 0 && (
                    <div className="text-sm text-green-600">
                      Cupom Válido! + {discount}% de desconto
                    </div>
                  )}
                  {discount == 0 && couponName != "" && (
                    <div className="text-sm text-red-600">Cupom Inválido!</div>
                  )}

                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Desconto</span>
                    <span>
                      R$ {discount_ammount.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6">
                <Button className="w-full" onClick={finalizarCompra}>
                  Finalizar Compra
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
