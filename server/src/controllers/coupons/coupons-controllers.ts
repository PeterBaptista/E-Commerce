import { Request, Response } from "express";
import supabase from "../../supabase/supabase";

export async function addCoupon(req: Request, res: Response) {  
  if (req.body.percentage < 0 || req.body.percentage > 100) {
    res.status(400).json({ error: "Percentage must be between 0 and 100" });
    return;
  }
  
  const { data, error } = await supabase.from('coupons')
  .insert([
    { codename: req.body.name, percentage: req.body.percentage, expiration_date: req.body.expiration_date || null },
  ]).select()
  
  if (error) res.status(500).json(error);
  else res.status(201).json(data);
}

export async function deleteCoupon(req: Request, res: Response) {    
  if (isNaN(+req.params.couponID)) {
    const {data, error:e} = await supabase
    .from('coupons').select('codename').eq('codename', req.params.couponID)

    if (!data || data.length === 0) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }

    if (e) res.status(500).json(e);
    
    const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('codename', req.params.couponID)
    if (error) res.status(500).json(error);
    else res.json("DELETED NAME " + req.params.couponID);
  } else {
    const {data, error:e} = await supabase
    .from('coupons').select('id').eq('id', +req.params.couponID)

    if (!data || data.length === 0) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }

    if (e) res.status(500).json(e);

    const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', +req.params.couponID)
    if (error) res.status(500).json(error);
    else res.json("DELETED ID " + req.params.couponID);
  }
}

export async function readAllCoupons(req: Request, res: Response) {  
  
  let { data, error } = await supabase
  .from('coupons')
  .select('*')
  
  if (error) res.status(500).json(error);
  else res.json(data);
}

export async function updateCoupons(req: Request, res: Response) {
  if (req.body.percentage < 0 || req.body.percentage > 100) {
    res.status(400).json({ error: "Percentage must be between 0 and 100" });
    return;
  }
  
  const { data: dd, error: ee } = await supabase
  .from('coupons')
  .select('codename')
  .eq('codename', req.body.name)

  if (!dd || dd.length === 0) {
    res.status(404).json({ error: "Coupon not found" });
    return;
  }
  if (ee) res.status(500).json(ee);

  const { data, error } = await supabase
  .from('coupons')
  .update({ percentage: req.body.percentage, expiration_date: req.body.expiration_date || null })
  .eq('codename', req.body.name)
  .select()

  if (error) res.status(500).json(error);
  else res.json(data);
}



// TEST ENVIROMENT

export async function addCoupon_test(req: Request, res: Response) {  
  if (req.body.percentage < 0 || req.body.percentage > 100) {
    res.status(400).json({ error: "Percentage must be between 0 and 100" });
    return;
  }
  
  const { data, error } = await supabase.from('coupons_test')
  .insert([
    { codename: req.body.name, percentage: req.body.percentage, expiration_date: req.body.expiration_date || null },
  ]).select()
  
  if (error) res.status(500).json(error);
  else res.status(201).json(data);
}

export async function deleteCoupon_test(req: Request, res: Response) {    
  if (isNaN(+req.params.couponID)) {
    const {data, error:e} = await supabase
    .from('coupons_test').select('codename').eq('codename', req.params.couponID)

    if (!data || data.length === 0) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }

    if (e) res.status(500).json(e);
    
    const { error } = await supabase
    .from('coupons_test')
    .delete()
    .eq('codename', req.params.couponID)
    if (error) res.status(500).json(error);
    else res.json("DELETED NAME " + req.params.couponID);
  } else {
    const {data, error:e} = await supabase
    .from('coupons_test').select('id').eq('id', +req.params.couponID)

    if (!data || data.length === 0) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }

    if (e) res.status(500).json(e);

    const { error } = await supabase
    .from('coupons_test')
    .delete()
    .eq('id', +req.params.couponID)
    if (error) res.status(500).json(error);
    else res.json("DELETED ID " + req.params.couponID);
  }
}

export async function readAllCoupons_test(req: Request, res: Response) {  
  
  let { data, error } = await supabase
  .from('coupons_test')
  .select('*')
  
  if (error) res.status(500).json(error);
  else res.json(data);
}

export async function updateCoupons_test(req: Request, res: Response) {
  if (req.body.percentage < 0 || req.body.percentage > 100) {
    res.status(400).json({ error: "Percentage must be between 0 and 100" });
    return;
  }

  const { data: dd, error: ee } = await supabase
  .from('coupons_test')
  .select('codename')
  .eq('codename', req.body.name)

  if (!dd || dd.length === 0) {
    res.status(404).json({ error: "Coupon not found" });
    return;
  }
  if (ee) res.status(500).json(ee);

  const { data, error } = await supabase
  .from('coupons_test')
  .update({ percentage: req.body.percentage, expiration_date: req.body.expiration_date || null })
  .eq('codename', req.body.name)
  .select()

  if (error) res.status(500).json(error);
  else res.json(data);
}
