"use client";

import { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ListingFields } from "@/lib/workbench";
import { getHandoffFrames } from "@/lib/frameHandoff";

type Store = "apple" | "google";

// Uploaded images become object URLs in this tab only; they are never saved or sent anywhere.
function useImages() {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => () => urls.forEach((url) => URL.revokeObjectURL(url)), [urls]);
  const fromBlobs = (blobs: Blob[]) => { if (blobs.length) setUrls(blobs.map((blob) => URL.createObjectURL(blob))); };
  const pick = (event: ChangeEvent<HTMLInputElement>, max: number) => {
    fromBlobs([...(event.target.files ?? [])].filter((file) => file.type.startsWith("image/")).slice(0, max));
    event.target.value = "";
  };
  return [urls, pick, fromBlobs] as const;
}

// Reports whether a one-line element is cut off at the frame's width.
function useClipped<T extends HTMLElement>(text: string) {
  const ref = useRef<T>(null);
  const [clipped, setClipped] = useState(false);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setClipped(element.scrollWidth > element.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);
  return [ref, clipped] as const;
}

const Icon = ({ src, name, className }: { src?: string; name: string; className: string }) => src
  ? <img className={className} src={src} alt=""/>
  : <span className={`${className} store-icon--empty`} aria-hidden="true">{(name.trim()[0] ?? "A").toUpperCase()}</span>;

function Shots({ urls, count, className, label }: { urls: string[]; count: number; className: string; label?: string }) {
  // A scrolling strip must be reachable by keyboard, so it gets focus and a name when it scrolls.
  return <div className={className} {...(label ? { role: "region", "aria-label": label, tabIndex: 0 } : {})}>{Array.from({ length: count }, (_, index) => urls[index]
    ? <img key={index} src={urls[index]} alt={`Screenshot ${index + 1}`}/>
    : <span key={index} className="store-shot--empty">Screenshot {index + 1}</span>)}</div>;
}

export function StorePreview({ fields }: { fields: ListingFields }) {
  const [store, setStore] = useState<Store>("apple");
  const [icon, pickIcon] = useImages();
  const [shots, pickShots, showBlobs] = useImages();
  const [fromStudio, setFromStudio] = useState<number | null>(null);
  // Frames exported from the studio in this tab arrive through memory, never storage.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("from") !== "frames") return;
    const frames = getHandoffFrames();
    showBlobs(frames.slice(0, 8));
    setFromStudio(frames.length);
  }, []);
  const name = (store === "apple" ? fields.appleName : fields.googleName) || "Your app name";
  const subtitle = (store === "apple" ? fields.appleSubtitle : fields.googleShort) || (store === "apple" ? "Your subtitle" : "Your short description");
  const description = (store === "apple" ? fields.appleDescription : fields.googleFull) || "The first lines of your description show here. Most people never tap more, so say what the app does and who it is for.";
  const [nameRef, nameClipped] = useClipped<HTMLElement>(`${store}:${name}`);
  const [subtitleRef, subtitleClipped] = useClipped<HTMLParagraphElement>(`${store}:${subtitle}`);

  return <section className="store-preview" aria-label="Store preview">
    <div className="store-preview__controls">
      <div className="segmented" role="group" aria-label="Store"><button aria-pressed={store === "apple"} onClick={() => setStore("apple")}>App Store</button><button aria-pressed={store === "google"} onClick={() => setStore("google")}>Google Play</button></div>
      <label className="file-button">Add icon<input type="file" accept="image/*" onChange={(event) => pickIcon(event, 1)}/></label>
      <label className="file-button">Add screenshots<input type="file" accept="image/*" multiple onChange={(event) => pickShots(event, 8)}/></label>
    </div>
    <p className="store-preview__note">Uses the text from the Apple and Google Play tabs. Images stay in this tab and are not saved.</p>
    {fromStudio !== null && <p className="notice" role="status">{fromStudio ? `Showing ${Math.min(fromStudio, 8)} frame${fromStudio === 1 ? "" : "s"} from the screenshot frame studio.` : "The studio frames are gone after a reload. Export them again from the screenshot frame studio."}</p>}
    <div className="store-preview__frames">
      <figure>
        <figcaption>Search result</figcaption>
        <div className={`store-frame store-frame--${store}`}>
          <div className="store-result">
            <Icon src={icon[0]} name={name} className="store-icon"/>
            <div className="store-result__text"><strong ref={nameRef}>{name}</strong>{store === "apple" && <p ref={subtitleRef}>{subtitle}</p>}</div>
            <span className="store-get" aria-hidden="true">{store === "apple" ? "Get" : "Install"}</span>
          </div>
          {store === "apple" && <Shots urls={shots} count={3} className="store-shots store-shots--result"/>}
        </div>
      </figure>
      <figure>
        <figcaption>Product page</figcaption>
        <div className={`store-frame store-frame--${store}`}>
          <div className="store-head">
            <Icon src={icon[0]} name={name} className="store-icon store-icon--large"/>
            <div><strong className="store-head__name">{name}</strong>{store === "apple" && <><p>{subtitle}</p><span className="store-get" aria-hidden="true">Get</span></>}</div>
          </div>
          {store === "google" && <span className="store-install" aria-hidden="true">Install</span>}
          <Shots urls={shots} count={Math.max(3, Math.min(shots.length, 8))} className="store-shots store-shots--page" label="Product page screenshots"/>
          {store === "apple" && fields.applePromotional && <p className="store-promo">{fields.applePromotional}</p>}
          {store === "google" && <><p className="store-about">About this app</p><p className="store-short">{subtitle}</p></>}
          <p className="store-description">{description}</p>
        </div>
      </figure>
    </div>
    <ul className="store-preview__checks" aria-live="polite">
      <li className={nameClipped ? "warn" : "good"}>{nameClipped ? "The name is cut off in the search result at this width. Put the part people search for first." : "The name fits on one line in the search result."}</li>
      {store === "apple" && <li className={subtitleClipped ? "warn" : "good"}>{subtitleClipped ? "The subtitle is cut off in the search result. Front-load the benefit." : "The subtitle fits on one line."}</li>}
      {store === "google" && <li className="neutral">Google Play search shows the name and icon; the short description opens “About this app”, so it is the first sentence people read.</li>}
      {store === "apple" && <li className={shots.length >= 3 ? "good" : "neutral"}>{shots.length >= 3 ? "Search shows your first three portrait screenshots. Read them left to right: do they tell the story?" : "Add your first three screenshots to see them as search shows them."}</li>}
    </ul>
    <p className="fine-print">The frames are about the width of a 6.1-inch phone. The stores change layouts, text size settings change truncation, and Apple can show your new search result asset instead of screenshots on iOS 27. Check the final page on a device.</p>
  </section>;
}
