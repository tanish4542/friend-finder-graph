
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center px-4">
      {icon && (
        <div className="w-16 h-16 mb-4 rounded-full bg-social-light flex items-center justify-center text-social-primary">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      
      {action && (
        <Button onClick={action.onClick} className="bg-social-primary hover:bg-social-tertiary">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
