import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  path: { label: string; href: string }[];
}

export const Breadcrumb = ({ path }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
      {path.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight size={16} className="mx-2" />}
          <a
            href={item.href}
            className={`hover:text-orange-500 ${
              index === path.length - 1 ? 'text-gray-900 font-medium' : ''
            }`}
          >
            {item.label}
          </a>
        </div>
      ))}
    </nav>
  );
};