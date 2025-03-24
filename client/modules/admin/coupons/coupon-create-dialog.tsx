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
import { CouponType } from "@/modules/products/types/coupons-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import CurrencyInput from "@/utils/currency-input";
import { z } from "zod";
import { couponEditSchema } from "../schemas/coupon-edit-schema";
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
import { Percent, PlusCircle } from "lucide-react";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { queryClient } from "@/providers/tanstack-query-provider";

function Content({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
  const form = useForm<z.infer<typeof couponEditSchema>>({
    resolver: zodResolver(couponEditSchema),
    defaultValues: {
      name: "",
      percentage: 0,
      expiration_date: undefined
    },
  });
  console.log(form.formState)

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
      const response = await axiosApi.post(`/coupons`, values);
      return response.data;
    },
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["coupons-query"],
      });
      toast({
        title: "Cupom criado",
        description: "O cupom foi criado com sucesso",
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

  async function onSubmit(values: z.infer<typeof couponEditSchema>) {
    mutate.mutate(
      {
        ...values,
        id: undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          queryClient.invalidateQueries({
            queryKey: ["coupons-query"],
          });
          toast({
            title: "Cupom criado",
            description: "O cupom foi criado com sucesso",
            variant: "default",
          });
        },
        onError: () => {
          form.reset(values);
          toast({
            title: "Erro ao criar cupom",
            description: "Ocorreu um erro ao criar o cupom",
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
            id="coupons-create-form"
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
                      placeholder="Nome do Cupom"
                      data-cy="coupon-name"
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
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentagem de desconto</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        data-cy="coupon-percentage"
                        value={field.value}
                        onChange={(e) => field.onChange(+e.target.value)}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de expiração</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        data-cy="coupon-expiration-date"
                        value={field.value ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          className="w-full"
          form="coupons-create-form"
          data-cy="submit-button"
        >
          Salvar
        </Button>
      </DialogFooter>
    </>
  );
}

export function DialogCreateCoupon({
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
          <DialogTitle> Adicionar Cupom</DialogTitle>
        </DialogHeader>

        <Content setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
