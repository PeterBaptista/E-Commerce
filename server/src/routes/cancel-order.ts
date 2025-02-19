import { Router } from "express";
import {
  attemptCancel
} from "../controllers/cancel-order/cancel-order-controllers";

const cancelOrderRouter = Router();

cancelOrderRouter.delete("/:orderId", attemptCancel);

export { cancelOrderRouter };