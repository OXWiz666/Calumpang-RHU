declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  
  // This allows any icon to be imported from lucide-react
  const icon: ComponentType<IconProps>;
  export default icon;
  
  // Export all icons as named exports
  export const Building2: ComponentType<IconProps>;
  export const Users: ComponentType<IconProps>;
  export const History: ComponentType<IconProps>;
  export const MapPin: ComponentType<IconProps>;
  export const HeartPulse: ComponentType<IconProps>;
  export const Calendar: ComponentType<IconProps>;
  export const CalendarDays: ComponentType<IconProps>;
  export const ChevronLeftIcon: ComponentType<IconProps>;
  export const Plus: ComponentType<IconProps>;
  export const Menu: ComponentType<IconProps>;
  export const X: ComponentType<IconProps>;
  export const Search: ComponentType<IconProps>;
  export const User: ComponentType<IconProps>;
  export const Home: ComponentType<IconProps>;
  export const Settings: ComponentType<IconProps>;
  export const Settings2: ComponentType<IconProps>;
  export const LogOut: ComponentType<IconProps>;
  export const ChevronDown: ComponentType<IconProps>;
  export const ChevronRight: ComponentType<IconProps>;
  export const Check: ComponentType<IconProps>;
  export const Clock: ComponentType<IconProps>;
  export const Mail: ComponentType<IconProps>;
  export const Phone: ComponentType<IconProps>;
  export const Info: ComponentType<IconProps>;
  export const AlertCircle: ComponentType<IconProps>;
  export const ArrowRight: ComponentType<IconProps>;
  export const ArrowLeft: ComponentType<IconProps>;
  export const Loader2: ComponentType<IconProps>;
  export const Github: ComponentType<IconProps>;
  export const LifeBuoy: ComponentType<IconProps>;
  export const CreditCard: ComponentType<IconProps>;
  export const Keyboard: ComponentType<IconProps>;
  export const Twitter: ComponentType<IconProps>;
  export const Cloud: ComponentType<IconProps>;
  export const ChevronsUpDown: ComponentType<IconProps>;
  export const MoreHorizontal: ComponentType<IconProps>;
  export const Trash: ComponentType<IconProps>;
  export const PenLine: ComponentType<IconProps>;
  export const Copy: ComponentType<IconProps>;
  export const CopyCheck: ComponentType<IconProps>;
  export const Download: ComponentType<IconProps>;
  export const ExternalLink: ComponentType<IconProps>;
  export const Ellipsis: ComponentType<IconProps>;
  export const EllipsisVertical: ComponentType<IconProps>;
  export const Facebook: ComponentType<IconProps>;
  export const Instagram: ComponentType<IconProps>;
  export const Linkedin: ComponentType<IconProps>;
  export const ChevronUp: ComponentType<IconProps>;
  export const Star: ComponentType<IconProps>;
  export const StarHalf: ComponentType<IconProps>;
  export const Stethoscope: ComponentType<IconProps>;
  export const Syringe: ComponentType<IconProps>;
  export const Baby: ComponentType<IconProps>;
  export const Pill: ComponentType<IconProps>;
  export const PlusCircle: ComponentType<IconProps>;
  export const Activity: ComponentType<IconProps>;
  export const FileText: ComponentType<IconProps>;
  export const BarChart: ComponentType<IconProps>;
  export const PieChart: ComponentType<IconProps>;
  export const LineChart: ComponentType<IconProps>;
  export const UserPlus: ComponentType<IconProps>;
  export const UserMinus: ComponentType<IconProps>;
  export const UserCheck: ComponentType<IconProps>;
  export const UserX: ComponentType<IconProps>;
  export const CircleCheck: ComponentType<IconProps>;
  export const CircleX: ComponentType<IconProps>;
  export const CircleAlert: ComponentType<IconProps>;
  export const CircleHelp: ComponentType<IconProps>;
  export const CircleInfo: ComponentType<IconProps>;
}
