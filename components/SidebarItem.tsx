import { IconType } from 'react-icons';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, href }) => {
  return (
    <Link
      href={href}
      className={twMerge(
        `flex items-center gap-x-4 w-full py-2 px-3 rounded-lg
         text-sm font-medium text-muted-foreground
         hover:text-foreground hover:bg-secondary/50
         transition-all duration-200`,
        active && 'text-foreground bg-secondary'
      )}
    >
      <Icon size={22} />
      <span className="truncate">{label}</span>
    </Link>
  );
};
