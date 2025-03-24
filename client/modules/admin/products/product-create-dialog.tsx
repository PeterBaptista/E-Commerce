import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductType } from "@/modules/products/types/product-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import CurrencyInput from "@/utils/currency-input";
import { z } from "zod";
import { productEditSchema } from "../schemas/product-edit-schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosApi } from "@/lib/axios-client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { PlusCircle } from "lucide-react";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { queryClient } from "@/providers/tanstack-query-provider";

function Content({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
  const form = useForm<z.infer<typeof productEditSchema>>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      id: "new",
      name: "",
      description: "",
      price: undefined,
      stock_quantity: 0,
      image_url: "",
      category_id: "",
      is_active: true,
    },
  });

  const { toast } = useToast();
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<{ value: string; label: string }[]> => {
      const response = await axiosApi("/category");
      return response.data.map((category: { id: number; name: string }) => ({
        value: category.id.toString(),
        label: category.name,
      }));
    },
  });

  const mutate = useMutation({
    mutationFn: async (values: any) => {
      const response = await axiosApi.post(`/products/new`, values);
      return response.data;
    },
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["products-query"],
      });
      toast({
        title: "Produto criado",
        description: "O produto foi criado com sucesso",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar produto",
        description: "Ocorreu um erro ao criar o produto",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof productEditSchema>) {
    mutate.mutate(
      {
        ...values,
        category_id: +values.category_id,
        discount: +values.discount + values.price,
        id: undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          queryClient.invalidateQueries({
            queryKey: ["products-query"],
          });
          toast({
            title: "Produto criado",
            description: "O produto foi criado com sucesso",
            variant: "default",
          });
        },
        onError: () => {
          form.reset(values);
          toast({
            title: "Erro ao criar produto",
            description: "Ocorreu um erro ao criar o produto",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-2 max-h-[80vh] overflow-auto px-0.5 pr-4">
        <Form {...form}>
          <form
            id="product-create-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Produto 0"
                      data-cy="product-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        {...field}
                        data-cy="product-price"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        {...field}
                        data-cy="product-discount"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidade</FormLabel>
                  <FormControl>
                    <div>
                      <Switch
                        data-state={field.value ? "checked" : "unchecked"}
                        data-cy="product-availability"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      data-cy="product-quantity"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={field.value}
                      onValueChange={(value: string) => field.onChange(value)}
                    >
                      <SelectTrigger
                        className="w-full"
                        data-cy="product-category"
                      >
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categorias</SelectLabel>
                          {categories.data?.map((category) => (
                            <SelectItem
                              data-cy="product-category-name"
                              data-cy-value={category.label}
                              key={category.value}
                              value={category.value.toString()}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} data-cy="product-image" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="descrição"
                      className="min-h-40"
                      data-cy="product-description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          className="w-full"
          form="product-create-form"
          data-cy="submit-button"
        >
          Salvar
        </Button>
      </DialogFooter>
    </>
  );
}

export function DialogCreateProduct({
  setOpen,
  open,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="pr-0">
        <DialogHeader className="pr-4">
          <DialogTitle> Adicionar Produto</DialogTitle>
        </DialogHeader>

        <Content setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
