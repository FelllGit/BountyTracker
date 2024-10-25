import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="flex items-center justify-around px-10 py-6 border-t-2">
      <Button variant="ghost" className="text-lg">
        About Us
      </Button>
      <Button variant="ghost" className="text-lg">
        Private Policy
      </Button>
      <Button variant="ghost" className="text-lg">
        Terms of Service
      </Button>
      <Button variant="ghost" className="text-lg">
        Help/FAQ
      </Button>
      <Button variant="ghost" className="text-lg">
        Contact US
      </Button>
    </footer>
  );
};

export default Footer;
