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
import { Switch } from "@/components/ui/switch";

import { queryClient } from "@/providers/tanstack-query-provider";

function Content({
  item,
  setOpen,
}: {
  item?: CouponType;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const defaultValues = {
    name: item?.codename ?? "",
    percentage: item?.percentage ?? 0,
    expiration_date: item?.expiration_date ?? undefined
  };

  const form = useForm<z.infer<typeof couponEditSchema>>({
    resolver: zodResolver(couponEditSchema),
    defaultValues: defaultValues,
  });

  const { toast } = useToast();

  const mutate = useMutation({
    mutationFn: async (values: any) => {
      
      const response = await axiosApi.put(`/coupons`, values);

      return response.data;
    },
  });

  async function onSubmit(values: z.infer<typeof couponEditSchema>) {
    mutate.mutate(
      { ...values },
      {
        onSuccess: () => {
          setOpen(false);
          queryClient.invalidateQueries({
            queryKey: ["coupons-query"],
          });
          toast({
            title: "Cupom atualizado",
            description: "O cupom foi atualizado com sucesso",
            variant: "default",
          });
        },
        onError: () => {
          toast({
            title: "Erro ao atualizar cupom",
            description: "Ocorreu um erro ao atualizar o cupom",
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
              id="coupons-update-form"
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
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : undefined}
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
            form="coupons-update-form"
            data-cy="submit-button"
          >
            Salvar
          </Button>
        </DialogFooter>
      </>
    );
  }

export function DialogEditCoupon({
  open,
  setOpen,
  item,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  item?: CouponType;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="pr-0">
        <DialogHeader className="pr-4">
          <DialogTitle> Editar Cupom</DialogTitle>
        </DialogHeader>

        <Content item={item} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
