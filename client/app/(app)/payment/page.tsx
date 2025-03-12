"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type JSX } from "react";
import mastercard from "../../../public/mastercard.png";
import visa from "../../../public/visa.png";

import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosApi } from "@/lib/axios-client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, DollarSign, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CardAPI {
  id: number;
  created_at: string;
  nickname: string;
  name: string;
  code_last4: string;
  expiration: string;
  card_type: CardType;
  code_iv: string;
  expiration_iv: string;
  code: string;
  transaction_type: string;
}

enum CardType {
  MasterCard = "MasterCard",
  Visa = "VISA",
}

const cardType: Record<CardType, JSX.Element> = {
  MasterCard: (
    <Image
      src={mastercard}
      alt="Picture of MasterCard"
      className="inline-block"
    />
  ),
  VISA: (
    <Image src={visa} alt="Picture of MasterCard" className="inline-block" />
  ),
};

export default function Payment() {
  const [optionSelected, setOptionSelected] = useState(0);
  const [cardSelected, setCardSelected] = useState(0);
  const [menuOpen, setMenuOpen] = useState(0);
  const [transactionType, setTransactionType] = useState("");
  const [formData, setFormData] = useState({
    nickname: "",
    name: "",
    code: "",
    month: "",
    year: "",
    cvc: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["cardsQuery"],
    queryFn: async (): Promise<CardAPI[]> => {
      const response = await axiosApi("/cards");
      return response.data;
    },
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

  if (isLoading) return <p>Carregando...</p>;

  function updateMenu(id: number) {
    if (menuOpen === id) {
      setMenuOpen(0);
    } else {
      setMenuOpen(id);
    }
  }

  async function deleteCard(id: number) {
    const answer = window
      .prompt("TEM CERTEZA QUE DESEJA REMOVER ESSE CARTÃO? (S/N)")
      ?.toUpperCase();

    if (answer === "S") {
      const response = await axiosApi(`/cards/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) window.alert("Cartão deletado com sucesso!");
      location.reload();
    }
    return;
  }

  async function updateCard() {
    console.log("ATUALIZANDO CARTÃO");

    const requestBody = {
      nickname: formData.nickname,
      name: formData.name,
      code: formData.code,
      expiration: `${formData.year}/${formData.month}`,
      cvc: formData.cvc,
      transactionType: transactionType,
    };

    console.log(requestBody);

    const response = await axiosApi(`/cards/${menuOpen}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(requestBody),
    });

    console.log(response);

    if (response.status === 200) {
      window.alert("CARTÃO ATUALIZADO COM SUCESSO!");
      location.reload();
    }
  }

  function handleSubmit() {
    window.alert("FINALIZANDO COMPRA!");
  }

  return (
    <div className="border rounded-lg p-4 shadow-lg mt-10">
      <h1 className="font-extrabold mb-2 text-2xl">PAGAMENTO</h1>
      <p className="text-gray-500 mb-10">
        Selecione o método de pagamento da compra
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between gap-4 px-4">
          <button
            id="select-card"
            type="button"
            onClick={() => setOptionSelected(1)}
            className={`h-20 items-center justify-center border-2 rounded-lg  shadow-md w-1/2 flex gap-2 ${
              optionSelected === 1 ? "dark:border-gray-300 border-black" : ""
            }`}
          >
            <CreditCard />
            <h2>Cartão</h2>
          </button>
          <button
            type="button"
            onClick={() => setOptionSelected(2)}
            className={`h-20 items-center justify-center border-2 rounded-lg  shadow-md w-1/2 flex gap-2 ${
              optionSelected === 2 ? "dark:border-gray-300 border-black" : ""
            }`}
          >
            <DollarSign />
            <h2>Pix</h2>
          </button>
        </div>

        {optionSelected === 1 && (
          <div className="mt-10 gap-4">
            <Link href="/payment/new_card">
              <button
                id="button-add-card"
                type="button"
                className="h-20 items-center justify-center border-2 rounded-lg  w-full hover:ring mb-4 flex gap-2"
              >
                <Plus />
                <h2>Adicionar cartão</h2>
              </button>
            </Link>
            <div className="grid">
              {data?.map((card: CardAPI) => (
                <div key={card.id} className="grid">
                  <Dialog>
                    <Card
                      onClick={() => {
                        setCardSelected(card.id);
                      }}
                      className={`cursor-pointer h-32 shadow-md px-4 rounded flex justify-between items-center mx-4 mb-4 ${
                        cardSelected === card.id ? "bg-muted-foreground/30" : ""
                      }`}
                    >
                      {cardType[card.card_type]}
                      <h3>
                        {card.nickname} - {card.code_last4}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            onClick={() => updateMenu(card.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") updateMenu(card.id);
                            }}
                            variant={"outline"}
                            className="w-12 h-12"
                          >
                            <DotsHorizontalIcon className="w-16 h-16" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Ação</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onClick={() => {
                                  setMenuOpen(card.id);
                                  setTransactionType(card.transaction_type);
                                  setFormData({
                                    ...formData,
                                    nickname: card.nickname,
                                    name: card.name,
                                  });
                                }}
                              >
                                Editar
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem
                              onClick={() => deleteCard(card.id)}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Card>

                    <DialogContent className="sm:max-w-[520px]">
                      <DialogHeader>
                        <DialogTitle>ATUALIZAÇÃO DE CARTÃO</DialogTitle>
                        <p className="text-sm">
                          ATUALIZE OS DADOS DO SEU CARTÃO
                        </p>
                      </DialogHeader>
                      <form className="grid gap-4 py-4">
                        <div className="grid w-full items-center gap-4">
                          <div className="flex justify-between gap-4 px-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setTransactionType("Credit")}
                              className={`h-12 items-center justify-center border-2 rounded-lg  shadow-md w-1/2 flex gap-2 ${
                                transactionType === "Credit"
                                  ? "border-foreground"
                                  : ""
                              }`}
                            >
                              <h2>CRÉDITO</h2>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setTransactionType("Debit")}
                              className={`h-12 items-center justify-center border-2 rounded-lg  shadow-md w-1/2 flex gap-2 ${
                                transactionType === "Debit"
                                  ? "border-foreground"
                                  : ""
                              }`}
                            >
                              <h2>DÉBITO</h2>
                            </Button>
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="nickname">Apelido</Label>
                            <Input
                              id="nickname"
                              name="nickname"
                              placeholder="apelido"
                              defaultValue={card.nickname}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="nome"
                              defaultValue={card.name}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="code">Número do cartão</Label>
                            <Input
                              id="code"
                              name="code"
                              placeholder="código"
                              defaultValue={card.code_last4}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <div className="grid grid-cols-2 gap-4">
                              <Label htmlFor="expiration">Vencimento</Label>
                              <Label htmlFor="cvc">CVC</Label>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <Select onValueChange={handleSelectChange}>
                                <SelectTrigger id="month" name="month">
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
                              />

                              <Input
                                id="cvc"
                                name="cvc"
                                placeholder="CVC"
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <Button type="button" onClick={updateCard}>
                          Atualizar
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-right align-bottom mt-4">
          <button
            type="button"
            className="rounded-lg p-4 shadow-md bg-red-500 text-white"
            onClick={() => history.back()}
          >
            <h2>Cancelar</h2>
          </button>
          <button
            type="submit"
            className="rounded-lg p-4 shadow-md bg-blue-950 text-white ml-4 mr-2"
          >
            <h2>Finalizar Compra</h2>
          </button>
        </div>
      </form>
    </div>
  );
}
