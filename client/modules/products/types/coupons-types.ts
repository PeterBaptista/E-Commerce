export type CouponType = {
    id: number;
    created_at: Date;
    codename: string;
    percentage: number;
    expiration_date?: Date;
  };
  