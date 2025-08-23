import { SVGProps } from "react";

export function ChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={8}
      viewBox="0 0 16 8"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.447 7.272a.687.687 0 01-.895 0l-6.416-5.5a.688.688 0 01.895-1.044L8 5.845l5.97-5.117a.688.688 0 11.894 1.044l-6.417 5.5z"
      />
    </svg>
  );
}
