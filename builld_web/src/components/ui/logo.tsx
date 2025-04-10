import { useScroll } from '@/context/scroll-context';
import Image from 'next/image';

export default function Logo() {
  const { scrollToSection } = useScroll();

  return (
    <button
      onClick={() => scrollToSection('hero')}
      className="flex items-center text-2xl font-bold text-foreground"
    >
      <Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
    </button>
  );
}
