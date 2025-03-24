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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { queryClient } from "@/providers/tanstack-query-provider";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


interface CardAPI {
  id: number;
  nickname: string;
  name: string;
  code_last4: string;
  card_type: CardType;
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
    <Image src={visa} alt="Picture of VISA" className="inline-block" />
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
  const [deletingCard, setDeletingCard] = useState<number>();
  const [alertOpen, setAlertOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm();

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
  
  const deleteCardMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosApi.delete(`/cards/${deletingCard}`);
      return response.data;
    },
  });
  
  const updateCardMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await axiosApi.put(`/cards/${menuOpen}`, values);
      return response.data;
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      month: String(months.indexOf(value) + 1).padStart(2, "0"),
    });
  };

  async function updateCard() {
    const requestBody = {
      nickname: formData.nickname,
      name: formData.name,
      code: formData.code,
      expiration: `${formData.year}/${formData.month}`,
      cvc: formData.cvc,
      transactionType: transactionType,
    };

    updateCardMutation.mutate(
      requestBody,
      {
        onSuccess: () => {
          toast({
            title: "Cartão atulizado",
            description: "O cartão foi atulizado com sucesso",
            variant: "default",
          });
          queryClient.invalidateQueries({queryKey: ["cardsQuery"]});
          setMenuOpen(0);
        },
        onError: () => {
          toast({
            title: "Erro ao atulizar cartão",
            description: "Ocorreu um erro ao atulizar o cartão",
            variant: "destructive",
          });
        },
      }
    );
  }

  async function deleteCard() {
    deleteCardMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Cartão deletado",
          description: "O cartão foi deletado com sucesso",
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ["cardsQuery"] });
      },
      onError: () => {
        toast({
          title: "Erro ao deletar cartão",
          description: "Ocorreu um erro ao deletar o cartão",
          variant: "destructive",
        });
      },
    });

    return;
  }


  if (isLoading) return <p>Carregando...</p>;
  
  function handleSubmit() {
    toast({
      title: "COMPRA FINALIZADA!",
      description: "COMPRA FINALIZADA COM SUCESSO!",
      variant: "default",
    });
  }

  function BotoesAtualizarRemover({ card }: { card: CardAPI }) {
    return (
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
                data-name={`update ${card.nickname}`}
              >
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem
              data-name={`delete ${card.nickname}`}
              onClick={() => { setDeletingCard(card.id); setAlertOpen(true);}}
            >
              Excluir
            </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    )
  }

  return (
    <div className="border rounded-lg p-4 shadow-lg mt-10">
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja deletar o cartão?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá deletar permanentemente sua conta e remover seus dados de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => { deleteCard().then(() => {
              queryClient.invalidateQueries({queryKey: ["cardsQuery"]});
            })}} id="delete-card">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <h1 className="font-extrabold mb-2 text-2xl">PAGAMENTO</h1>
      <p className="text-gray-500 mb-10">
        Selecione o método de pagamento da compra
      </p>


      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                  className="h-20 items-center justify-center border-2 rounded-lg w-full hover:ring mb-4 flex gap-2"
                >
                  <Plus />
                  <h2>Adicionar cartão</h2>
                </button>
              </Link>
              <div className="grid">
                {data?.map((card: CardAPI) => (
                  <div key={card.id} className="grid" data-name={card.nickname}>
                    <Dialog>
                      <Card
                        id={`card-${card.id}`}
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
                              id={`card-update-${card.id}`}
                              data-name={`update-${card.nickname}`}
                              onClick={() => setMenuOpen(card.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") setMenuOpen(card.id);
                              }}
                              variant={"outline"}
                              className="w-12 h-12"
                            >
                              <DotsHorizontalIcon className="w-16 h-16" />
                            </Button>
                          </DropdownMenuTrigger>
                          <BotoesAtualizarRemover card={card}/>
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
                                id="dialog-credit"
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
                                id="dialog-debit"
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
                                      <SelectItem id={month} key={month} value={month}>
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
                          <Button id="dialog-update-card" type="button" onClick={updateCard}>
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

          <div className="text-right align-bottom mt-4 space-x-4">
            <Button variant="destructive" size="lg">Cancelar</Button>
            <Button type="submit" size="lg">Finalizar Compra</Button>
          </div>
        </form>
      </Form>
    </div>
    );
}
