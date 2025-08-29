import React from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecurityWarningProps {
  message: string;
  type?: 'warning' | 'danger';
  className?: string;
}

const SecurityWarning: React.FC<SecurityWarningProps> = ({ 
  message, 
  type = 'warning',
  className = ""
}) => {
  return (
    <Alert className={`${className} ${type === 'danger' ? 'border-red-500 bg-red-950/10' : 'border-yellow-500 bg-yellow-950/10'}`}>
      {type === 'danger' ? (
        <AlertTriangle className="h-4 w-4 text-red-400" />
      ) : (
        <Shield className="h-4 w-4 text-yellow-400" />
      )}
      <AlertDescription className={type === 'danger' ? 'text-red-300' : 'text-yellow-300'}>
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default SecurityWarning;