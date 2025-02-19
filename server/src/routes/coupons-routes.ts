import { Router } from "express";
import { addCoupon, readAllCoupons, deleteCoupon, updateCoupons,
         addCoupon_test, readAllCoupons_test, deleteCoupon_test, updateCoupons_test
        } 
from "../controllers/coupons/coupons-controllers";

const couponsRouter = Router();

couponsRouter.get("/", readAllCoupons);
couponsRouter.post("/", addCoupon);
couponsRouter.delete("/:couponID", deleteCoupon);
couponsRouter.put('/', updateCoupons);

const couponsRouter_test = Router();
couponsRouter_test.get("/", readAllCoupons_test);
couponsRouter_test.post("/", addCoupon_test);
couponsRouter_test.delete("/:couponID", deleteCoupon_test);
couponsRouter_test.put('/', updateCoupons_test);

export { couponsRouter, couponsRouter_test };