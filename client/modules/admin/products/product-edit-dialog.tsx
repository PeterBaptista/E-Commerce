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
import { Switch } from "@/components/ui/switch";

function Content({
  item,
  setOpen,
}: {
  item?: ProductType;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const defaultValues = {
    id: item?.id ?? "",
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: item?.price ?? 0,
    stock_quantity: item?.stock_quantity ?? 0,
    image_url: item?.image_url ?? "",
    category_id: item?.category_id?.toString() ?? "",
    is_active: item?.is_active ?? true,
    discount: item?.discount && item?.discount ? item.discount - item.price : 0,
  };

  const form = useForm<z.infer<typeof productEditSchema>>({
    resolver: zodResolver(productEditSchema),
    defaultValues: defaultValues,
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
      const response = await axiosApi.put(`/products/${values.id}`, values);
      return response.data;
    },
  });

  async function onSubmit(values: z.infer<typeof productEditSchema>) {
    console.log("resposta: ", values);
    mutate.mutate(
      {
        ...values,
        category_id: +values.category_id,
        discount: +values.discount + values.price,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast({
            title: "Produto atualizado",
            description: "O produto foi atualizado com sucesso",
            variant: "default",
          });
        },
        onError: () => {
          toast({
            title: "Erro ao atualizar produto",
            description: "Ocorreu um erro ao atualizar o produto",
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

export function DialogEditProduct({
  open,
  setOpen,
  item,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  item?: ProductType;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="pr-0">
        <DialogHeader className="pr-4">
          <DialogTitle> Editar Produto</DialogTitle>
        </DialogHeader>

        <Content item={item} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
