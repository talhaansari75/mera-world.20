const publisher = String(process.env.VITE_ADSENSE_PUBLISHER_ID ?? '').trim();
if (!publisher) {
  console.log('[ads] VITE_ADSENSE_PUBLISHER_ID not set: ad integration is safely disabled.');
  process.exit(0);
}
if (!/^ca-pub-\d{10,32}$/.test(publisher)) {
  console.error('[ads] invalid VITE_ADSENSE_PUBLISHER_ID format');
  process.exit(1);
}
console.log(`[ads] AdSense publisher configured: ${publisher.slice(0, 10)}…`);
console.log('[ads] H5 Games placement: level-complete -> next level');
console.log('[ads] Ad-free entitlement product: ad_free');
