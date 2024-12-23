import { Button } from "../atoms/Button";

interface NavbarProps {
  btnFn: () => void;
}
export const Navbar = ({ btnFn }: NavbarProps) => (
  <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Menu Setting Configuration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            <div className="inline-block bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs font-medium">
              Reorder
            </div>
            <div className="inline-block bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs font-medium">
              Hide
            </div>
            <div className="inline-block bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs font-medium">
              Show
            </div>
            Menu Items at your fingertips
          </p>
        </div>
        <Button variant="primary" onClick={() => btnFn()}>
          Save Changes
        </Button>
      </div>
    </div>
  </div>
);
