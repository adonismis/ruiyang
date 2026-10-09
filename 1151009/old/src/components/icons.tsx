import type { SVGProps } from "react";

export function ArrowIcon({
  diagonal = false,
  ...props
}: SVGProps<SVGSVGElement> & { diagonal?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

export function LineIcon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: "building" | "shield" | "quality" | "leaf" | "news" | "pin";
}) {
  const paths = {
    building: (
      <>
        <path d="M4 21V8l8-4v17M12 10h8v11M2 21h20M7 10v2m0 3v2m9-3h1m-1 3h1" />
        <path d="M10 21v-3" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    quality: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="m8 14-2 7 6-3 6 3-2-7m-7-5 2 2 4-4" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 3C10 2 4 7 4 13a7 7 0 0 0 14 0c0-4 2-10 2-10Z" />
        <path d="M4 21 15 9m-7 8v-6m0 6h6" />
      </>
    ),
    news: (
      <>
        <path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h3m2 0h3M8 18h8" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
