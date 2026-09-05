"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Phone, MessageSquare } from "lucide-react";
import { site } from "@/content/site";
import { allowTracking, captureTouch, trackSiteEvent, configureSiteTracking, trackingPageContext } from "@/lib/siteTracking";

export function SiteExperience({ gaId, gtmId }: { gaId?: string; gtmId?: string }) {
  const pathname = usePathname();
  const [choice, setChoice] = useState<"unset" | "yes" | "no">("unset");
  const [privatePage, setPrivatePage] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    configureSiteTracking({ gaId, gtmId });
    if (location.pathname.startsWith("/admin")) { setPrivatePage(true); return; }
    captureTouch();
    let value: "unset" | "yes" | "no" = "unset";
    try { const saved = localStorage.getItem("rcc.analytics-choice"); if (saved === "yes" || saved === "no") value = saved; } catch {}
    if (navigator.doNotTrack === "1") value = "no";
    setChoice(value); allowTracking(value === "yes");
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      const href = link?.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackSiteEvent("call_tap");
      else if (href.startsWith("sms:")) trackSiteEvent("text_tap");
      else if (href.includes("get-offer") || href.includes("get-my-cash-offer")) trackSiteEvent("offer_cta");
    };
    const resize = () => setKeyboard(Boolean(window.visualViewport && window.visualViewport.height < window.innerHeight * .75));
    document.addEventListener("click", click);
    window.visualViewport?.addEventListener("resize", resize);
    return () => { document.removeEventListener("click", click); window.visualViewport?.removeEventListener("resize", resize); };
  }, [gaId, gtmId]);
  useEffect(() => { if (!pathname.startsWith("/admin")) captureTouch(); }, [pathname]);
  function choose(value: "yes" | "no") {
    setChoice(value); allowTracking(value === "yes");
    try { localStorage.setItem("rcc.analytics-choice", value); } catch {}
    // Reload after withdrawal so scripts that have already loaded stop running.
    if (value === "no" && choice === "yes") location.reload();
  }
  if (privatePage) return null;
  const configured = Boolean(gaId || gtmId);
  return <>
    <nav className="mobile-actions" data-keyboard={keyboard} aria-label="Contact actions"><a className="button" href="/get-offer">Request an offer</a><a href={site.phoneHref}><Phone size={19} aria-hidden="true" />Call</a><a href={site.smsHref}><MessageSquare size={19} aria-hidden="true" />Text</a></nav>
    {configured && <div className="tracking-choice"><p>{choice === "unset" ? "Allow optional analytics to help us improve the website? Your offer request works either way." : `Optional analytics: ${choice === "yes" ? "allowed" : "off"}.`}</p>{choice !== "yes" && <button onClick={() => choose("yes")}>Allow analytics</button>}{choice !== "no" && <button onClick={() => choose("no")}>{choice === "yes" ? "Turn off analytics" : "Keep analytics off"}</button>}<a className="text-link" href="/privacy">Privacy</a></div>}
    {choice === "yes" && !gtmId && gaId && <><Script id="rcc-ga-config" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});gtag('js',new Date());gtag('config',${JSON.stringify(gaId)},${JSON.stringify({ ...trackingPageContext(pathname), send_page_view: true })});`}</Script><Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" /></>}
    {choice === "yes" && gtmId && <Script id="rcc-gtm" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});`}</Script>}
    {choice === "yes" && gtmId && <Script src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`} strategy="afterInteractive" />}
  </>;
}
