import { Router } from "express";
import {
	createCard,
	deleteCard,
	getAllCards,
	getCardSelected,
	updateCard,
	putCardSelected,
} from "../controllers/card/card-controllers";
import {
	parseCardSchema,
	validateCard,
} from "../controllers/card/utils/card-utils";

const cardRouter = Router();

// Define routes

cardRouter.get("/", getAllCards);
cardRouter.get("/card-selected", getCardSelected);
cardRouter.post("/new", parseCardSchema, validateCard, createCard);
cardRouter.delete("/:id", deleteCard);
cardRouter.put("/:id", parseCardSchema, validateCard, updateCard);
cardRouter.post("/card-selected", putCardSelected);

export { cardRouter };
