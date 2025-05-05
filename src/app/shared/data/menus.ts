export interface Menu {
  path: string;
  name: string;
}

export const menuList: Menu[] = [
  {
    path: '/products',
    name: 'Products'
  },
 // { path: '/cart', name: 'Cart' },   // 🔥 Real cart page!

  {
    path: '/contact',
    name: 'Contact'
  },
  {
    path: '/dashboard',
    name: 'Dashboard'
  },
  {
    path: '/doc',
    name: 'Doc'
  }
];
