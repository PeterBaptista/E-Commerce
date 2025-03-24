import type { Request, Response } from "express";
import supabase from "../../supabase/supabase";
import type { CardType } from "./schema/card-schemas";
import { cardTypeValidation, encryptData } from "./utils/card-utils";

export async function getAllCards(req: Request, res: Response) {
	const { data, error } = await supabase
		.from("cards")
		.select("id, nickname, name, code_last4, card_type, transaction_type")
		.order("id", { ascending: false });

	if (error) res.status(500).json(error);

	console.log(data);

	res.json(data);
}

export async function getCardSelected(req: Request, res: Response) {
	const { data: cards, error: errorCards } = await supabase
		.from("cards")
		.select("id, nickname, name, code_last4, card_type, transaction_type")
		.order("id", { ascending: false });

	const { data: cardSelected, error: errorCardSelected } = await supabase
		.from("card-selected")
		.select("*")
		.eq("id_user", 2);

	if (errorCards) res.status(500).json(errorCards);
	if (errorCardSelected) res.status(500).json(errorCardSelected);

	cards?.find((card) => {
		if (card.id === cardSelected?.[0].id_card) res.json(card ?? null);
	});
}

export async function createCard(req: Request, res: Response) {
	const card: CardType = req.body;

	const cardType = cardTypeValidation(card.code);

	const encryptedNumber = encryptData(card.code);
	const encryptedExpiration = encryptData(card.expiration);

	const { error, data } = await supabase
		.from("cards")
		.insert({
			nickname: card.nickname,
			name: card.name,
			expiration: encryptedExpiration.encryptedData,
			code: encryptedNumber.encryptedData,
			card_type: cardType,
			code_last4: card.code.substring(card.code.length - 4),
			code_iv: encryptedNumber.iv,
			expiration_iv: encryptedExpiration.iv,
			transaction_type: card.transactionType,
		})
		.select();

	if (error) res.status(500).json(error);

	res.json(data?.[0] ?? null);
}

export async function deleteCard(req: Request, res: Response) {
	const { id } = req.params;

	const { error } = await supabase.from("cards").delete().eq("id", Number(id));

	if (error) res.status(500).json(error);

	res.send("Card deleted successfully");
}

export async function updateCard(req: Request, res: Response) {
	const card: CardType = req.body;
	const { id } = req.params;

	const cardType = cardTypeValidation(card.code);

	const encryptedNumber = encryptData(card.code);
	const encryptedExpiration = encryptData(card.expiration);

	const { data, error } = await supabase
		.from("cards")
		.update({
			nickname: card.nickname,
			name: card.name,
			expiration: encryptedExpiration.encryptedData,
			code: encryptedNumber.encryptedData,
			card_type: cardType,
			code_last4: card.code.substring(card.code.length - 4),
			code_iv: encryptedNumber.iv,
			expiration_iv: encryptedExpiration.iv,
		})
		.eq("id", Number(id))
		.select();

	if (error) res.status(500).json(error);

	res.json(data?.[0] ?? null);
}

export async function putCardSelected(req: Request, res: Response) {
	const cardSelected = req.body;

	const { data, error } = await supabase
		.from("card-selected")
		.update({
			id_card: cardSelected.id_card,
		})
		.eq("id_user", cardSelected.id_user)
		.select();

	if (error) res.status(500).json(error);

	res.json(data?.[0] ?? null);
}
