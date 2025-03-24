"use client";

import ShoppingCartItem from "./shopping-cart-card";
import { useQueries, useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/providers/tanstack-query-provider";

import type React from "react";

import { useState } from "react";
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
import SelecionarCartao from "./selecionarCartao";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { set } from "zod";

export default function AdicionarCartao() {
  const [transactionType, setTransactionType] = useState("");
  const [formData, setFormData] = useState({
    nickname: "",
    name: "",
    code: "",
    month: "",
    year: "",
    cvc: "",
  });
  const [dialogAdicionarAberto, setDialogAdicionarAberto] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      month: String(months.indexOf(value) + 1).padStart(2, "0"),
    });
  };

  const newCardMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await axiosApi.post("/cards/new", values);
      return response.data;
    },
  });

  const submitCartao = async () => {
    const requestBody = {
      nickname: formData.nickname,
      name: formData.name,
      code: formData.code,
      expiration: `${formData.year}/${formData.month}`,
      cvc: formData.cvc,
      transactionType: transactionType,
    };

    console.log(requestBody);

    newCardMutation.mutate(requestBody, {
      onSuccess: () => {
        toast({
          title: "Cartão criado",
          description: "O cartão foi criado com sucesso",
          variant: "default",
        });
        setDialogAdicionarAberto(false);
      },
      onError: () => {
        toast({
          title: "Erro ao criar cartão",
          description: "Ocorreu um erro ao criar o cartão",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog
      open={dialogAdicionarAberto}
      onOpenChange={setDialogAdicionarAberto}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Adicionar Novo Cartão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cartão</DialogTitle>
          <DialogDescription>Preencha os dados do seu cartão</DialogDescription>
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <div className="flex justify-between gap-4 px-4">
            <button
              type="button"
              id="select-credit"
              onClick={() => setTransactionType("Credit")}
              className={`h-12 items-center justify-center border-2 rounded-lg  shadow-md w-1/2 flex gap-2 ${
                transactionType === "Credit"
                  ? "dark:border-gray-300 border-black"
                  : ""
              }`}
            >
              <h2>CRÉDITO</h2>
            </button>
            <button
              type="button"
              id="select-debit"
              onClick={() => setTransactionType("Debit")}
              className={`h-12 items-center justify-center border-2 rounded-lg  shadow-md w-1/2 flex gap-2 ${
                transactionType === "Debit"
                  ? "dark:border-gray-300 border-black"
                  : ""
              }`}
            >
              <h2>DÉBITO</h2>
            </button>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="nickname">Apelido</Label>
            <Input
              id="nickname"
              name="nickname"
              placeholder="Apelido para o cartão adicionado"
              onChange={handleChange}
              value={formData.nickname}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nome completo do cartão"
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="code">Número do cartão</Label>
            <Input
              id="code"
              name="code"
              placeholder="Todos os dígitos do cartão"
              onChange={handleChange}
              value={formData.code}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="expiration">Vencimento</Label>
              <Label htmlFor="cvc">CVC</Label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {months.map((month) => (
                    <SelectItem key={month} value={month} id={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                id="year"
                name="year"
                placeholder="Ano"
                onChange={handleChange}
                value={formData.year}
              />

              <Input
                id="cvc"
                name="cvc"
                placeholder="CVC"
                onChange={handleChange}
                value={formData.cvc}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={() => setDialogAdicionarAberto(false)}
          >
            Cancel
          </Button>
          <Button id="cadastrar" type="submit" onClick={() => submitCartao()}>
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
