# Navigation Components Documentation (Phase 3)

This document provides comprehensive documentation for all navigation components in the Shreehari Mart design system.

## Table of Contents

1. [Breadcrumb](#breadcrumb)
2. [Tabs](#tabs)
3. [Pagination](#pagination)
4. [DropdownMenu](#dropdownmenu)
5. [SidebarMenu](#sidebarmenu)
6. [Stepper](#stepper)
7. [NavLink](#navlink)

---

## Breadcrumb

A navigation component that displays the user's current location within the application hierarchy.

### Props

```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  onNavigate?: (href: string) => void;
}
```

### Basic Usage

```tsx
import { Breadcrumb } from '@/components/ui';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptop' },
  ]}
/>;
```

### With Icons

```tsx
import { Breadcrumb } from '@/components/ui';
import {
  IconHome,
  IconShoppingCart,
  IconDeviceLaptop,
} from '@tabler/icons-react';

<Breadcrumb
  items={[
    { label: 'Home', href: '/', icon: <IconHome size={16} /> },
    {
      label: 'Products',
      href: '/products',
      icon: <IconShoppingCart size={16} />,
    },
    { label: 'Laptop', icon: <IconDeviceLaptop size={16} /> },
  ]}
/>;
```

### Custom Separator

```tsx
<Breadcrumb
  items={items}
  separator=">"
/>

<Breadcrumb
  items={items}
  separator={<IconChevronRight size={14} />}
/>
```

### With Navigation Handler

```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

<Breadcrumb items={items} onNavigate={(href) => router.push(href)} />;
```

### Features

- **Automatic Last Item**: Last item is automatically rendered as text (non-clickable)
- **Icon Support**: Each item can have an optional icon
- **Custom Separators**: Use string or React components
- **Click Handling**: Optional navigation handler for client-side routing

---

## Tabs

A component for switching between different views or sections of content.

### Props

```typescript
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'outline' | 'pills';
  items: {
    value: string;
    label: string;
    icon?: ReactNode;
    content?: ReactNode;
  }[];
}
```

### Basic Usage

```tsx
import { Tabs } from '@/components/ui';

<Tabs
  items={[
    { value: 'overview', label: 'Overview', content: <p>Overview content</p> },
    { value: 'details', label: 'Details', content: <p>Details content</p> },
    { value: 'settings', label: 'Settings', content: <p>Settings content</p> },
  ]}
/>;
```

### Variants

```tsx
// Default variant
<Tabs variant="default" items={items} />

// Outline variant
<Tabs variant="outline" items={items} />

// Pills variant
<Tabs variant="pills" items={items} />
```

### With Icons

```tsx
import { IconHome, IconSettings, IconUser } from '@tabler/icons-react';

<Tabs
  items={[
    {
      value: 'home',
      label: 'Home',
      icon: <IconHome size={16} />,
      content: <HomeContent />,
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: <IconSettings size={16} />,
      content: <SettingsContent />,
    },
  ]}
/>;
```

### Controlled Tabs

```tsx
const [activeTab, setActiveTab] = useState('overview');

<Tabs value={activeTab} onChange={setActiveTab} items={items} />;
```

### Features

- **Three Variants**: Default, outline, and pills styles
- **Icon Support**: Optional icons for each tab
- **Controlled/Uncontrolled**: Can be used in both modes
- **Content Management**: Automatically shows/hides panel content

---

## Pagination

A component for navigating through pages of data.

### Props

```typescript
interface PaginationProps {
  total: number;
  page?: number;
  defaultPage?: number;
  onChange?: (page: number) => void;
  siblings?: number;
  boundaries?: number;
  withEdges?: boolean;
}
```

### Basic Usage

```tsx
import { Pagination } from '@/components/ui';

<Pagination total={10} onChange={(page) => console.log('Page:', page)} />;
```

### Controlled Pagination

```tsx
const [page, setPage] = useState(1);

<Pagination total={20} page={page} onChange={setPage} />;
```

### With Configuration

```tsx
<Pagination
  total={50}
  siblings={2} // Number of siblings on each side
  boundaries={2} // Number of boundary pages
  withEdges // Show first/last page buttons
  onChange={handlePageChange}
/>
```

### Features

- **Configurable Display**: Control number of siblings and boundaries
- **Edge Controls**: Optional first/last page buttons
- **Controlled/Uncontrolled**: Flexible state management
- **Responsive**: Automatically adjusts for mobile

---

## DropdownMenu

A click-triggered menu with support for icons, dividers, and nested items.

### Props

```typescript
interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  type?: 'item' | 'divider';
  color?: string;
}

interface DropdownMenuProps {
  label: ReactNode;
  items: DropdownMenuItem[];
  variant?: 'default' | 'outline' | 'subtle';
}
```

### Basic Usage

```tsx
import { DropdownMenu } from '@/components/ui';

<DropdownMenu
  label="Actions"
  items={[
    { label: 'Edit', onClick: () => handleEdit() },
    { label: 'Delete', onClick: () => handleDelete() },
  ]}
/>;
```

### With Icons

```tsx
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';

<DropdownMenu
  label="More"
  items={[
    { label: 'View', icon: <IconEye size={16} />, onClick: handleView },
    { label: 'Edit', icon: <IconEdit size={16} />, onClick: handleEdit },
    { type: 'divider' },
    {
      label: 'Delete',
      icon: <IconTrash size={16} />,
      onClick: handleDelete,
      color: 'red',
    },
  ]}
/>;
```

### With Custom Trigger

```tsx
<DropdownMenu
  label={<IconButton icon={<IconDotsVertical />} variant="subtle" />}
  items={items}
/>
```

### Variants

```tsx
<DropdownMenu label="Actions" items={items} variant="default" />
<DropdownMenu label="Actions" items={items} variant="outline" />
<DropdownMenu label="Actions" items={items} variant="subtle" />
```

### Features

- **Icon Support**: Optional icons for menu items
- **Dividers**: Separate menu sections
- **Color Variants**: Apply colors to individual items
- **Custom Triggers**: Use any ReactNode as trigger
- **Multiple Variants**: Default, outline, and subtle button styles

---

## SidebarMenu

A vertical navigation menu with support for nested items, badges, and icons.

### Props

```typescript
interface SidebarMenuItem {
  label: string;
  icon?: ReactNode;
  href?: string;
  badge?: string | number;
  badgeColor?: string;
  children?: SidebarMenuItem[];
  active?: boolean;
}

interface SidebarMenuProps {
  items: SidebarMenuItem[];
  onNavigate?: (href: string) => void;
}
```

### Basic Usage

```tsx
import { SidebarMenu } from '@/components/ui';

<SidebarMenu
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Products', href: '/products' },
    { label: 'Orders', href: '/orders' },
  ]}
/>;
```

### With Icons and Badges

```tsx
import { IconHome, IconShoppingCart, IconUsers } from '@tabler/icons-react';

<SidebarMenu
  items={[
    {
      label: 'Dashboard',
      icon: <IconHome size={18} />,
      href: '/dashboard',
      active: true,
    },
    {
      label: 'Products',
      icon: <IconShoppingCart size={18} />,
      href: '/products',
      badge: '12',
      badgeColor: 'blue',
    },
    {
      label: 'Users',
      icon: <IconUsers size={18} />,
      href: '/users',
      badge: 'New',
      badgeColor: 'green',
    },
  ]}
/>;
```

### With Nested Items

```tsx
<SidebarMenu
  items={[
    { label: 'Dashboard', icon: <IconHome />, href: '/dashboard' },
    {
      label: 'Products',
      icon: <IconShoppingCart />,
      children: [
        { label: 'All Products', href: '/products' },
        { label: 'Categories', href: '/products/categories' },
        { label: 'Brands', href: '/products/brands' },
      ],
    },
    {
      label: 'Orders',
      icon: <IconShoppingBag />,
      badge: '5',
      children: [
        { label: 'All Orders', href: '/orders' },
        {
          label: 'Pending',
          href: '/orders/pending',
          badge: '3',
          badgeColor: 'orange',
        },
        { label: 'Completed', href: '/orders/completed' },
      ],
    },
  ]}
/>
```

### With Navigation Handler

```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

<SidebarMenu items={items} onNavigate={(href) => router.push(href)} />;
```

### Features

- **Nested Navigation**: Support for multi-level menu items
- **Collapsible Groups**: Parent items with children can expand/collapse
- **Badges**: Display counts or labels on menu items
- **Active States**: Highlight current page
- **Icon Support**: Optional icons for each item
- **Click Handling**: Custom navigation handler

---

## Stepper

A component for displaying progress through a multi-step process.

### Props

```typescript
interface StepperProps {
  active: number;
  onStepClick?: (stepIndex: number) => void;
  allowStepSelect?: boolean;
  steps: {
    label: string;
    description?: string;
    icon?: ReactNode;
  }[];
  children?: ReactNode;
}
```

### Basic Usage

```tsx
import { Stepper } from '@/components/ui';

const [active, setActive] = useState(0);

<Stepper
  active={active}
  steps={[
    { label: 'Personal Info' },
    { label: 'Account Details' },
    { label: 'Confirmation' },
  ]}
/>;
```

### With Descriptions

```tsx
<Stepper
  active={active}
  steps={[
    {
      label: 'Personal Info',
      description: 'Enter your personal details',
    },
    {
      label: 'Account Details',
      description: 'Set up your account',
    },
    {
      label: 'Confirmation',
      description: 'Review and confirm',
    },
  ]}
/>
```

### With Icons

```tsx
import { IconUser, IconLock, IconCheck } from '@tabler/icons-react';

<Stepper
  active={active}
  steps={[
    { label: 'Personal', icon: <IconUser size={18} /> },
    { label: 'Security', icon: <IconLock size={18} /> },
    { label: 'Complete', icon: <IconCheck size={18} /> },
  ]}
/>;
```

### Interactive Stepper

```tsx
<Stepper
  active={active}
  onStepClick={setActive}
  allowStepSelect
  steps={steps}
/>
```

### With Step Content

```tsx
<Stepper active={active} steps={steps}>
  {active === 0 && <PersonalInfoForm />}
  {active === 1 && <AccountDetailsForm />}
  {active === 2 && <ConfirmationView />}
</Stepper>
```

### Features

- **Progress Tracking**: Visual indication of current step
- **Step Descriptions**: Optional detailed text
- **Icon Support**: Custom icons for each step
- **Interactive**: Optional click-to-navigate
- **Content Slots**: Render different content per step
- **Completed State**: Automatically marks previous steps as complete

---

## NavLink

A styled navigation link with support for active states and badges.

### Props

```typescript
interface NavLinkProps {
  href: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  badge?: string | number;
  badgeColor?: string;
  onClick?: () => void;
}
```

### Basic Usage

```tsx
import { NavLink } from '@/components/ui';

<NavLink href="/dashboard" label="Dashboard" />;
```

### With Icon

```tsx
import { IconHome } from '@tabler/icons-react';

<NavLink href="/dashboard" label="Dashboard" icon={<IconHome size={18} />} />;
```

### With Badge

```tsx
<NavLink
  href="/notifications"
  label="Notifications"
  icon={<IconBell size={18} />}
  badge="5"
  badgeColor="red"
/>
```

### Active State

```tsx
<NavLink
  href="/dashboard"
  label="Dashboard"
  icon={<IconHome size={18} />}
  active
/>
```

### With Click Handler

```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

<NavLink
  href="/products"
  label="Products"
  onClick={() => {
    router.push('/products');
    // Additional logic
  }}
/>;
```

### In a Navigation List

```tsx
<nav>
  <NavLink href="/dashboard" label="Dashboard" icon={<IconHome />} active />
  <NavLink href="/products" label="Products" icon={<IconShoppingCart />} />
  <NavLink href="/orders" label="Orders" icon={<IconShoppingBag />} badge="3" />
  <NavLink href="/customers" label="Customers" icon={<IconUsers />} />
</nav>
```

### Features

- **Active Highlighting**: Visual indication of current page
- **Badge Support**: Display counts or labels
- **Icon Support**: Optional leading icon
- **Click Handling**: Custom click handlers
- **Styled States**: Hover, active, and focus states

---

## Common Patterns

### Building a Complete Navigation

```tsx
import { Breadcrumb, SidebarMenu, NavLink } from '@/components/ui';

function Layout({ children }) {
  return (
    <div>
      <aside>
        <SidebarMenu items={menuItems} />
      </aside>
      <main>
        <Breadcrumb items={breadcrumbItems} />
        {children}
      </main>
    </div>
  );
}
```

### Multi-Step Form

```tsx
import { Stepper, Form, Button } from '@/components/ui';

function MultiStepForm() {
  const [active, setActive] = useState(0);

  const nextStep = () => setActive((current) => Math.min(current + 1, 2));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

  return (
    <>
      <Stepper
        active={active}
        steps={[
          { label: 'Step 1', description: 'Enter details' },
          { label: 'Step 2', description: 'Review info' },
          { label: 'Step 3', description: 'Complete' },
        ]}
      >
        {active === 0 && <Step1Form />}
        {active === 1 && <Step2Form />}
        {active === 2 && <Step3Form />}
      </Stepper>

      <Button onClick={prevStep} disabled={active === 0}>
        Back
      </Button>
      <Button onClick={nextStep} disabled={active === 2}>
        Next
      </Button>
    </>
  );
}
```

### Tabbed Content with Pagination

```tsx
import { Tabs, Pagination } from '@/components/ui';

function ProductList() {
  const [page, setPage] = useState(1);

  return (
    <Tabs
      items={[
        {
          value: 'all',
          label: 'All Products',
          content: (
            <>
              <ProductGrid page={page} />
              <Pagination total={10} page={page} onChange={setPage} />
            </>
          ),
        },
        {
          value: 'featured',
          label: 'Featured',
          content: <FeaturedProducts />,
        },
      ]}
    />
  );
}
```

### Dropdown Actions Menu

```tsx
import { DropdownMenu, IconButton } from '@/components/ui';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';

function ProductActions({ product }) {
  return (
    <DropdownMenu
      label={<IconButton icon={<IconDotsVertical />} variant="subtle" />}
      items={[
        {
          label: 'Edit',
          icon: <IconEdit size={16} />,
          onClick: () => handleEdit(product),
        },
        { type: 'divider' },
        {
          label: 'Delete',
          icon: <IconTrash size={16} />,
          onClick: () => handleDelete(product),
          color: 'red',
        },
      ]}
    />
  );
}
```

---

## Best Practices

### Breadcrumb

- Keep breadcrumb paths short and meaningful
- Use icons sparingly (usually just for home)
- Make intermediate items clickable
- Show full path for complex hierarchies

### Tabs

- Limit to 5-7 tabs maximum
- Use descriptive labels
- Consider pills variant for primary navigation
- Use outline for secondary sections

### Pagination

- Show appropriate number of siblings based on screen size
- Always display first and last page for large datasets
- Consider infinite scroll for mobile

### DropdownMenu

- Group related actions with dividers
- Place destructive actions at the bottom
- Use icons for quick recognition
- Keep menu items concise

### SidebarMenu

- Group related items under parent categories
- Limit nesting to 2 levels
- Use badges for notifications
- Highlight active page clearly

### Stepper

- Use 3-5 steps maximum
- Provide descriptions for clarity
- Allow backward navigation
- Show completion states clearly

### NavLink

- Use consistent iconography
- Show badge counts for notifications
- Maintain clear active states
- Group related links together

---

## TypeScript Support

All navigation components are fully typed with TypeScript. Import types as needed:

```typescript
import type {
  BreadcrumbProps,
  BreadcrumbItem,
  TabsProps,
  PaginationProps,
  DropdownMenuProps,
  DropdownMenuItem,
  SidebarMenuProps,
  SidebarMenuItem,
  StepperProps,
  NavLinkProps,
} from '@/components/ui';
```

---

## Accessibility

All components follow accessibility best practices:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Use of appropriate HTML elements
- **Role Attributes**: Correct ARIA roles where needed

---

## Related Components

- **Phase 1**: Typography, Buttons, Icons, Avatars, Badges
- **Phase 2**: Form Components (Input, Select, etc.)
- **Phase 4**: Cards & Containers (upcoming)
- **Phase 5**: Feedback Components (upcoming)

For more information, see:

- [Theme Documentation](./THEME_DOCUMENTATION.md)
- [Component Quick Reference](./COMPONENT_QUICK_REFERENCE.md)
- [Form Components Documentation](./FORM_COMPONENTS_DOCUMENTATION.md)
