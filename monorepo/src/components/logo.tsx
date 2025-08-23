import darkLogo from "@/assets/logos/dark.svg";
import logo from "@/assets/logos/main.svg";
import Image from "next/image";
import lixerLogo from '@/assets/logos/lixer.png';

export function Logo() {
  return (
    <div className="relative h-8 max-w-[10.847rem]">
      {/* <Image
        src={logo}
        fill
        className="dark:hidden"
        alt="Lixer logo"
        role="presentation"
        quality={100}
      />

      <Image
        src={darkLogo}
        fill
        className="hidden dark:block"
        alt="Lixer logo"
        role="presentation"
        quality={100}
      /> */}

      <Image
        src={lixerLogo}
        width={100}
        height={100}
        className="hidden dark:block"
        alt="Lixer logo"
        role="presentation"
        quality={100}
        />

      <Image
        src={lixerLogo}
        width={100}
        height={100}
        className="dark:hidden"
        alt="Lixer logo"
        role="presentation"
        quality={100}
        />

    </div>
  );
}
