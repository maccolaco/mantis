// assets
import { 
  DashboardOutlined,
  PieChartOutlined,
  TableOutlined,
  SettingOutlined,
  FileTextOutlined
  ExperimentOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  PieChartOutlined,
  TableOutlined,
  SettingOutlined,
  FileTextOutlined,
  ExperimentOutlined
};

// ==============================|| MENU ITEMS - PORTFOLIO ||============================== //

const portfolio = {
  id: 'group-portfolio',
  title: 'Portfolio Management',
  type: 'group',
  children: [
    {
      id: 'portfolio-dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/portfolio/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'portfolio-analytics',
      title: 'Risk Analytics',
      type: 'item',
      url: '/portfolio/analytics',
      icon: icons.ExperimentOutlined
    },
    {
      id: 'portfolio-holdings',
      title: 'Holdings',
      type: 'item',
      url: '/portfolio/holdings',
      icon: icons.TableOutlined
    },
    {
      id: 'portfolio-reports',
      title: 'Reports',
      type: 'item',
      url: '/portfolio/reports',
      icon: icons.FileTextOutlined
    },
    {
      id: 'portfolio-settings',
      title: 'Settings',
      type: 'item',
      url: '/portfolio/settings',
      icon: icons.SettingOutlined
    }
  ]
};

export default portfolio;