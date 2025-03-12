"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosApi } from "@/lib/axios-client";

export default function NewCardPage() {
  const [transactionType, setTransactionType] = useState("");
  const [formData, setFormData] = useState({
    nickname: "",
    name: "",
    code: "",
    month: "",
    year: "",
    cvc: "",
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestBody = {
      nickname: formData.nickname,
      name: formData.name,
      code: formData.code,
      expiration: `${formData.year}/${formData.month}`,
      cvc: formData.cvc,
      transactionType: transactionType,
    };

    console.log(requestBody);

    const response = await axiosApi("/cards/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },

      data: JSON.stringify(requestBody),
    });

    if (response.status === 200) {
      window.alert("Cartão cadastrado com sucesso!");
      location.replace("/payment");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-[510px]">
        <CardHeader>
          <CardTitle>CADASTRO DE CARTÃO</CardTitle>
          <CardDescription>
            Adicione um novo cartão na sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex justify-between gap-4 px-4">
              <button
                type="button"
                onClick={() => setTransactionType("Credit")}
                className={`h-12 items-center justify-center border-2 rounded-lg  shadow-md w-1/2 flex gap-2 ${
                  transactionType === "Credit" ? "dark:border-gray-300 border-black" : ""
                }`}
              >
                <h2>CRÉDITO</h2>
              </button>
              <button
                type="button"
                onClick={() => setTransactionType("Debit")}
                className={`h-12 items-center justify-center border-2 rounded-lg  shadow-md w-1/2 flex gap-2 ${
                  transactionType === "Debit" ? "dark:border-gray-300 border-black" : ""
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
                      <SelectItem key={month} value={month}>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="w-1/5 bg-muted"
            variant="outline"
            onClick={() => history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-3/4">
            Cadastrar
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
