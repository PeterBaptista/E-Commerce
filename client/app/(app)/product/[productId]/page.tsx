"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, Share, ShoppingCart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { axiosApi } from "@/lib/axios-client";
import { ProductType } from "@/modules/products/types/product-types";
import { ItemsCarousel } from "@/modules/home/components/items-carousel";
import { ProductCard } from "@/modules/home/components/product-card";
import { Spinner } from "@/components/spinner";
import { queryClient } from "@/providers/tanstack-query-provider";

export default function ProductPage() {
  const { productId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["productQuery"],
    queryFn: async (): Promise<ProductType> => {
      const response = await axiosApi.get(`/products/${productId}`);
      return response.data;
    },
  });
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("m");

  const { data: onCart, isLoading: onCartLoading } = useQuery({
    queryKey: ["onCartQuery"],
    queryFn: async (): Promise<ProductType> => {
      const response = await axiosApi.get(`/shopping-cart/${productId}`);
      return response.data;
    },
  });

  const addCartMutate = useMutation({
    mutationFn: async () => {
      await axiosApi
        .post(`/shopping-cart/add`, {
          id: productId,
          amount: quantity,
        })
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["onCartQuery"],
          });
        });
    },
  });

  const { data: relatedProducts, isLoading: relatedProductsLoading } = useQuery(
    {
      queryKey: ["productsQuery"],
      queryFn: async (): Promise<ProductType[]> => {
        const response = await axiosApi("/products");
        return response.data;
      },
    }
  );

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Spinner />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <span className="text-xl font-bold">Produto não encontrado</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-white overflow-hidden rounded-lg border">
            <Image
              src={data?.image_url || "/placeholder.svg"}
              alt={data?.name || ""}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{data?.name ?? "--"}</h1>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(data?.rating ?? 0)
                        ? "fill-primary text-primary"
                        : i < (data?.rating ?? 0)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({data?.reviewCount ?? 0} avaliações)
              </span>
            </div>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-bold">
              R${data?.price.toFixed(2)}
            </span>
            {data?.discount && (
              <span className="text-lg text-muted-foreground line-through">
                R${data?.discount.toFixed(2)}
              </span>
            )}
            {data?.discount && (
              <Badge className="bg-destructive dark:bg-red-500">
                Economize R${(data?.discount - data?.price).toFixed(2)}
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground ">{data?.description}</p>

          <Separator />

          {/* Quantity and Add to Cart */}
          {!onCart || onCartLoading ? (
            <>
              <div>
                <h2 className="mb-2 text-lg font-medium">Quantidade</h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                className="flex-1 w-full"
                size="lg"
                disabled={onCartLoading || addCartMutate.isPending}
                onClick={() => addCartMutate.mutate()}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao carrinho
              </Button>
            </>
          ) : (
            <div className="flex-1 w-full h-12 flex items-center justify-center text-lg font-medium bg-green-100 text-green-700 rounded-md">
              Produto no carrinho
            </div>
          )}

          {/* Product Status */}
          <div className="text-sm">
            {(data?.stock_quantity ?? 0) > 0 ? (
              <span className="text-green-600">Em estoque</span>
            ) : (
              <span className="text-destructive">Sem estoque</span>
            )}
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Descrição</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p>{data?.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Related Products */}
      <div className="mt-16 container">
        <h2 className="text-2xl font-bold mb-6">Você pode também gostar</h2>
        <ItemsCarousel
          isLoading={relatedProductsLoading}
          items={
            relatedProducts?.map((item) => {
              return <ProductCard product={item} />;
            }) ?? []
          }
        />
      </div>
    </div>
  );
}
