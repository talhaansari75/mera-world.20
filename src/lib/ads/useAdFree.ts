import { useEffect, useState } from "react";
import { getMyEntitlements } from "@/lib/v13/payments/server";
import { AD_FREE_PRODUCT_ID } from "./h5GamesAds";

export function useAdFree() {
  const [adFree, setAdFree] = useState(false);

  useEffect(() => {
    let alive = true;
    void getMyEntitlements()
      .then((rows) => {
        if (!alive) return;
        setAdFree(rows.some((row) => row.productId === AD_FREE_PRODUCT_ID && row.active && (!row.expiresAt || new Date(row.expiresAt).getTime() > Date.now())));
      })
      .catch(() => {
        if (alive) setAdFree(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return adFree;
}
