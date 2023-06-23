import { IconType } from 'react-icons';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

//* Declaring the type for the SidebarItem component's properties
interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

//* SidebarItem component using React Function Component with SidebarItemProps
export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, href }) => {
  //* The component includes a Link component, which is used for navigation
  return (
    <Link
      href={href}
      className={twMerge(
        `
        flex
        flex-row
        h-auto
        items-center
        w-full
        gap-x-4
        text-md
        font-medium
        cursor-pointer
        hover:text-white
        transition
        text-neutral-400
        py-1
        `,
        active && 'text-white'
      )}
    >
      <Icon size={26} />
      <p className="truncate w-100">{label}</p>
    </Link>
  );
};
