// eslint-disable-next-line no-restricted-imports
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex items-center justify-around px-10 py-6 border-t-2">
      <Link href="/privacy-policy" className="text-lg">
        Private Policy
      </Link>
      <Link href="/terms-conditions" className="text-lg">
        Terms of Service
      </Link>
      <Link href="https://x.com/lmanualm" target="_blank" className="text-lg">
        Contact us
      </Link>
    </footer>
  );
};

export default Footer;
