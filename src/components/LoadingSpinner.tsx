
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

const LoadingSpinner = ({ size = 24, message = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader className="animate-spin text-social-primary" size={size} />
      <p className="mt-4 text-muted-foreground text-sm">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
