# Navigation Components - Quick Reference

Quick reference for all navigation components in the Shreehari Mart design system.

## 🧭 Navigation Components (7)

### 1. Breadcrumb

**Purpose**: Show navigation hierarchy

```tsx
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics' },
  ]}
/>
```

**Key Props**: `items[]`, `separator`, `onNavigate`

---

### 2. Tabs

**Purpose**: Switch between views

```tsx
<Tabs
  items={[
    { value: 'tab1', label: 'Tab 1', content: <Content1 /> },
    { value: 'tab2', label: 'Tab 2', content: <Content2 /> },
  ]}
/>
```

**Variants**: `default`, `outline`, `pills`  
**Key Props**: `items[]`, `value`, `onChange`, `variant`

---

### 3. Pagination

**Purpose**: Navigate pages

```tsx
<Pagination total={10} page={currentPage} onChange={setPage} />
```

**Key Props**: `total`, `page`, `onChange`, `siblings`, `withEdges`

---

### 4. DropdownMenu

**Purpose**: Contextual actions menu

```tsx
<DropdownMenu
  label="Actions"
  items={[
    { label: 'Edit', onClick: handleEdit },
    { type: 'divider' },
    { label: 'Delete', onClick: handleDelete },
  ]}
/>
```

**Variants**: `default`, `outline`, `subtle`  
**Key Props**: `label`, `items[]`, `variant`

---

### 5. SidebarMenu

**Purpose**: Vertical navigation with nesting

```tsx
<SidebarMenu
  items={[
    { label: 'Dashboard', href: '/', icon: <IconHome /> },
    {
      label: 'Products',
      children: [
        { label: 'All', href: '/products' },
        { label: 'New', href: '/products/new' },
      ],
    },
  ]}
/>
```

**Key Props**: `items[]`, `onNavigate`  
**Features**: Icons, badges, nested items, active states

---

### 6. Stepper

**Purpose**: Multi-step process

```tsx
<Stepper
  active={currentStep}
  steps={[
    { label: 'Step 1', description: 'First step' },
    { label: 'Step 2', description: 'Second step' },
    { label: 'Step 3', description: 'Final step' },
  ]}
/>
```

**Key Props**: `active`, `steps[]`, `onStepClick`, `allowStepSelect`

---

### 7. NavLink

**Purpose**: Styled navigation link

```tsx
<NavLink
  href="/dashboard"
  label="Dashboard"
  icon={<IconHome />}
  badge="5"
  active
/>
```

**Key Props**: `href`, `label`, `icon`, `badge`, `active`, `onClick`

---

## Common Patterns

### Layout with Breadcrumb & Sidebar

```tsx
function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: 250 }}>
        <SidebarMenu items={menuItems} />
      </aside>
      <main style={{ flex: 1, padding: '1rem' }}>
        <Breadcrumb items={breadcrumbs} />
        {children}
      </main>
    </div>
  );
}
```

### Multi-Step Form

```tsx
function Wizard() {
  const [step, setStep] = useState(0);

  return (
    <>
      <Stepper
        active={step}
        steps={[{ label: 'Info' }, { label: 'Review' }, { label: 'Complete' }]}
      />

      {step === 0 && <InfoForm />}
      {step === 1 && <ReviewForm />}
      {step === 2 && <CompleteForm />}

      <Button onClick={() => setStep(step + 1)}>Next</Button>
    </>
  );
}
```

### Tabbed Content with Pagination

```tsx
function ProductsPage() {
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);

  return (
    <Tabs
      value={tab}
      onChange={setTab}
      items={[
        {
          value: 'all',
          label: 'All Products',
          content: (
            <>
              <ProductList page={page} />
              <Pagination total={20} page={page} onChange={setPage} />
            </>
          ),
        },
        { value: 'featured', label: 'Featured', content: <Featured /> },
      ]}
    />
  );
}
```

### Dropdown Actions

```tsx
function TableRow({ item }) {
  return (
    <tr>
      <td>{item.name}</td>
      <td>
        <DropdownMenu
          label={<IconButton icon={<IconDotsVertical />} variant="subtle" />}
          items={[
            { label: 'View', icon: <IconEye />, onClick: () => view(item) },
            { label: 'Edit', icon: <IconEdit />, onClick: () => edit(item) },
            { type: 'divider' },
            {
              label: 'Delete',
              icon: <IconTrash />,
              color: 'red',
              onClick: () => del(item),
            },
          ]}
        />
      </td>
    </tr>
  );
}
```

### Nested Sidebar Navigation

```tsx
const menuItems = [
  {
    label: 'Dashboard',
    icon: <IconHome />,
    href: '/dashboard',
    active: true,
  },
  {
    label: 'Products',
    icon: <IconShoppingCart />,
    badge: '12',
    children: [
      { label: 'All Products', href: '/products' },
      { label: 'Categories', href: '/products/categories' },
      { label: 'Brands', href: '/products/brands' },
    ],
  },
  {
    label: 'Orders',
    icon: <IconShoppingBag />,
    badge: '3',
    badgeColor: 'red',
    children: [
      { label: 'Pending', href: '/orders/pending', badge: '3' },
      { label: 'Completed', href: '/orders/completed' },
    ],
  },
];

<SidebarMenu items={menuItems} onNavigate={(href) => router.push(href)} />;
```

---

## Import Examples

```tsx
// Single import
import { Breadcrumb } from '@/components/ui';

// Multiple imports
import {
  Breadcrumb,
  Tabs,
  Pagination,
  DropdownMenu,
  SidebarMenu,
  Stepper,
  NavLink,
} from '@/components/ui';

// With types
import type {
  BreadcrumbProps,
  TabsProps,
  PaginationProps,
  DropdownMenuProps,
  SidebarMenuProps,
  StepperProps,
  NavLinkProps,
} from '@/components/ui';
```

---

## Props Summary

| Component        | Required Props    | Optional Props                                            |
| ---------------- | ----------------- | --------------------------------------------------------- |
| **Breadcrumb**   | `items`           | `separator`, `onNavigate`                                 |
| **Tabs**         | `items`           | `value`, `onChange`, `variant`, `defaultValue`            |
| **Pagination**   | `total`           | `page`, `onChange`, `siblings`, `boundaries`, `withEdges` |
| **DropdownMenu** | `label`, `items`  | `variant`                                                 |
| **SidebarMenu**  | `items`           | `onNavigate`                                              |
| **Stepper**      | `active`, `steps` | `onStepClick`, `allowStepSelect`, `children`              |
| **NavLink**      | `href`, `label`   | `icon`, `badge`, `badgeColor`, `active`, `onClick`        |

---

## Item Structures

### BreadcrumbItem

```typescript
{
  label: string;
  href?: string;
  icon?: ReactNode;
}
```

### TabItem

```typescript
{
  value: string;
  label: string;
  icon?: ReactNode;
  content?: ReactNode;
}
```

### DropdownMenuItem

```typescript
{
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  type?: 'item' | 'divider';
  color?: string;
}
```

### SidebarMenuItem

```typescript
{
  label: string;
  icon?: ReactNode;
  href?: string;
  badge?: string | number;
  badgeColor?: string;
  children?: SidebarMenuItem[];
  active?: boolean;
}
```

### StepItem

```typescript
{
  label: string;
  description?: string;
  icon?: ReactNode;
}
```

---

## Tips

### Breadcrumb

- ✅ Keep paths short (3-5 levels max)
- ✅ Last item should not be clickable
- ✅ Use icons sparingly (home icon is common)
- ❌ Don't repeat current page in breadcrumb

### Tabs

- ✅ Limit to 5-7 tabs for usability
- ✅ Use icons for visual clarity
- ✅ Pills variant for primary navigation
- ❌ Don't nest tabs within tabs

### Pagination

- ✅ Show first/last with `withEdges` for large datasets
- ✅ Adjust `siblings` based on screen size
- ✅ Always show current page clearly
- ❌ Don't use pagination for <5 pages (show all instead)

### DropdownMenu

- ✅ Group actions with dividers
- ✅ Place destructive actions at bottom
- ✅ Use red color for delete actions
- ❌ Don't have more than 10 items (use search)

### SidebarMenu

- ✅ Limit nesting to 2 levels
- ✅ Use badges for notifications
- ✅ Highlight active page
- ❌ Don't overuse badges (only for important counts)

### Stepper

- ✅ Keep to 3-5 steps
- ✅ Allow backward navigation
- ✅ Show descriptions for clarity
- ❌ Don't skip steps in sequence

### NavLink

- ✅ Use consistent icons across app
- ✅ Show clear active states
- ✅ Use badges for unread counts
- ❌ Don't use too many badge colors

---

## Complete Navigation Example

```tsx
import {
  Breadcrumb,
  SidebarMenu,
  Tabs,
  Pagination,
  DropdownMenu,
  IconButton,
} from '@/components/ui';
import {
  IconDotsVertical,
  IconHome,
  IconShoppingCart,
} from '@tabler/icons-react';

function ProductsPage() {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('all');

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 250 }}>
        <SidebarMenu
          items={[
            { label: 'Dashboard', icon: <IconHome />, href: '/' },
            {
              label: 'Products',
              icon: <IconShoppingCart />,
              active: true,
              children: [
                { label: 'All Products', href: '/products' },
                { label: 'Categories', href: '/products/categories' },
              ],
            },
          ]}
        />
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
        />

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            {
              value: 'all',
              label: 'All Products',
              content: (
                <div>
                  {/* Product Table */}
                  <table>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>
                            <DropdownMenu
                              label={<IconButton icon={<IconDotsVertical />} />}
                              items={[
                                { label: 'Edit', onClick: () => {} },
                                {
                                  label: 'Delete',
                                  onClick: () => {},
                                  color: 'red',
                                },
                              ]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <Pagination
                    total={20}
                    page={page}
                    onChange={setPage}
                    withEdges
                  />
                </div>
              ),
            },
            {
              value: 'featured',
              label: 'Featured',
              content: <div>Featured products</div>,
            },
          ]}
        />
      </main>
    </div>
  );
}
```

---

## Related Documentation

- 📘 [Full Navigation Documentation](./NAVIGATION_COMPONENTS_DOCUMENTATION.md)
- 📗 [Theme Documentation](./THEME_DOCUMENTATION.md)
- 📙 [Component Inventory](./COMPONENT_INVENTORY.md)
- 📕 [Form Components](./FORM_COMPONENTS_DOCUMENTATION.md)
