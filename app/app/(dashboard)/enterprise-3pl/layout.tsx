
import { ReactNode } from 'react';

interface Enterprise3PLLayoutProps {
  children: ReactNode;
}

export default function Enterprise3PLLayout({ children }: Enterprise3PLLayoutProps) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
}
