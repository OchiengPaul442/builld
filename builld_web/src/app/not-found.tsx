import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="absolute top-8 left-0 w-full flex justify-center z-10">
        <Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
      </div>
      <main className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-12">
        <h1 className="text-7xl sm:text-8xl font-bold text-[#b0ff00] mb-4 drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-6">
          Page Not Found
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
          <br />
          Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#b0ff00] text-black px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-[#9ee600] transition-colors duration-200"
        >
          Go Home
        </Link>
      </main>
      <div className="absolute bottom-8 left-0 w-full flex justify-center z-10">
        <span className="text-xs text-gray-500">
          Builld &mdash; Fast-Track Your Ideas into Reality
        </span>
      </div>
    </div>
  );
}
