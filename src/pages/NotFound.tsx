import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page not found");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-600 mb-6">
          This page does not exist or has moved.
        </p>
        <Button asChild size="lg">
          <Link to="/">Back to the dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
