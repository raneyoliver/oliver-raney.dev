export interface CabinetConfig {
  id: string;
  title: string;
  route: string;
  color: string;
  subtitle: string;
}

export const CABINETS: CabinetConfig[] = [
  {
    id: 'about',
    title: 'ABOUT ME',
    route: '/about',
    color: '#00FFFF',
    subtitle: 'WHO I AM',
  },
  {
    id: 'projects',
    title: 'PROJECTS',
    route: '/projects',
    color: '#FF00FF',
    subtitle: 'MY WORK',
  },
  {
    id: 'resume',
    title: 'RESUME',
    route: '/resume',
    color: '#39FF14',
    subtitle: 'EXPERIENCE',
  },
  {
    id: 'contact',
    title: 'CONTACT',
    route: '/contact',
    color: '#FFBF00',
    subtitle: 'GET IN TOUCH',
  },
  {
    id: 'blog',
    title: 'BLOG',
    route: '/blog',
    color: '#FF6B6B',
    subtitle: 'MY THOUGHTS',
  },
  {
    id: 'skills',
    title: 'SKILLS',
    route: '/skills',
    color: '#A855F7',
    subtitle: 'TECH STACK',
  },
];
