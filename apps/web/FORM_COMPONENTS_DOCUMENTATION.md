# Form Components Documentation

## 🧮 Form Components (Molecules)

All form components are located in `src/components/ui/` and built on Mantine components with custom theming.

---

## Component List

### 1. Input

Standard text input field with variants and icon support.

**Usage:**

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  placeholder="Enter your email..."
  value={value}
  onChange={(e) => setValue(e.currentTarget.value)}
/>

// With icon
<Input
  label="Search"
  placeholder="Search..."
  icon={<SearchIcon />}
/>
```

**Props:**

- `variant`: 'default' | 'filled' | 'unstyled'
- `icon`: ReactNode - Left section icon
- All Mantine TextInput props (label, placeholder, error, disabled, etc.)

---

### 2. Textarea

Multi-line text input with auto-resize.

**Usage:**

```tsx
import { Textarea } from '@/components/ui';

<Textarea
  label="Description"
  placeholder="Enter description..."
  minRows={3}
  value={value}
  onChange={(e) => setValue(e.currentTarget.value)}
/>;
```

**Props:**

- `variant`: 'default' | 'filled' | 'unstyled'
- `minRows`: number - Minimum number of rows
- All Mantine Textarea props

---

### 3. Select

Dropdown selection component.

**Usage:**

```tsx
import { Select } from '@/components/ui';

<Select
  label="Category"
  placeholder="Select category"
  data={[
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
  ]}
  value={value}
  onChange={setValue}
/>

// Simple array
<Select
  data={['Option 1', 'Option 2', 'Option 3']}
/>
```

**Props:**

- `variant`: 'default' | 'filled' | 'unstyled'
- `data`: Array of strings or objects with value/label
- All Mantine Select props

---

### 4. Checkbox

Boolean input with label and description.

**Usage:**

```tsx
import { Checkbox } from '@/components/ui';

<Checkbox
  label="I agree to terms"
  description="Please read our terms and conditions"
  checked={checked}
  onChange={(e) => setChecked(e.currentTarget.checked)}
/>;
```

**Props:**

- `variant`: 'filled' | 'outline'
- All Mantine Checkbox props

---

### 5. RadioGroup

Exclusive option selection.

**Usage:**

```tsx
import { RadioGroup } from '@/components/ui';

<RadioGroup
  label="Delivery Method"
  description="Choose your delivery option"
  value={value}
  onChange={setValue}
  options={[
    {
      value: 'standard',
      label: 'Standard',
      description: '5-7 days',
      disabled: false,
    },
    { value: 'express', label: 'Express', description: '2-3 days' },
  ]}
  orientation="vertical" // or 'horizontal'
/>;
```

**Props:**

- `options`: Array<{ value, label, description?, disabled? }>
- `orientation`: 'vertical' | 'horizontal'
- All Mantine Radio.Group props

---

### 6. Switch

Toggle on/off component.

**Usage:**

```tsx
import { Switch } from '@/components/ui';

<Switch
  label="Enable notifications"
  description="Receive updates via email"
  checked={enabled}
  onChange={(e) => setEnabled(e.currentTarget.checked)}
/>;
```

**Props:**

- All Mantine Switch props

---

### 7. Slider

Range input slider.

**Usage:**

```tsx
import { Slider } from '@/components/ui';

<Slider
  label="Volume"
  value={volume}
  onChange={setVolume}
  min={0}
  max={100}
  step={5}
  marks={[
    { value: 0, label: '0%' },
    { value: 50, label: '50%' },
    { value: 100, label: '100%' },
  ]}
/>;

// For range slider, use Mantine's RangeSlider directly
import { RangeSlider } from '@mantine/core';
<RangeSlider defaultValue={[20, 80]} />;
```

**Props:**

- `min`, `max`, `step`: number
- `marks`: Array of { value, label }
- All Mantine Slider props

---

### 8. DatePicker

Date selection component.

**Usage:**

```tsx
import { DatePicker } from '@/components/ui';

<DatePicker
  label="Select Date"
  placeholder="Pick a date"
  value={date}
  onChange={(value) => setDate(value as Date | null)}
/>;
```

**Props:**

- `variant`: 'default' | 'filled' | 'unstyled'
- `valueFormat`: string (default: 'DD/MM/YYYY')
- All Mantine DatePickerInput props

**Note:** Requires `@mantine/dates` package (already installed)

---

### 9. FileUpload

File input with optional preview.

**Usage:**

```tsx
import { FileUpload } from '@/components/ui';

<FileUpload
  label="Upload Image"
  placeholder="Choose file..."
  accept="image/*"
  showPreview
  onFileChange={(file) => console.log(file)}
/>;
```

**Props:**

- `variant`: 'default' | 'filled' | 'unstyled'
- `accept`: string - File type filter
- `maxSize`: number - Max file size in MB
- `showPreview`: boolean - Show image preview
- `onFileChange`: (file: File | null) => void

---

### 10. SearchInput

Input field optimized for search with built-in search icon.

**Usage:**

```tsx
import { SearchInput } from '@/components/ui';

<SearchInput
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.currentTarget.value)}
  onSearch={(value) => performSearch(value)}
/>;
```

**Props:**

- `variant`: 'default' | 'filled' | 'unstyled'
- `onSearch`: (value: string) => void
- `searchIcon`: ReactNode - Custom search icon
- All Mantine TextInput props

---

### 11. FormField

Wrapper component for label, hint, and error display.

**Usage:**

```tsx
import { FormField } from '@/components/ui';

<FormField
  label="Email"
  hint="We'll never share your email"
  error={errors.email}
  required
>
  <Input placeholder="Enter email" />
</FormField>;
```

**Props:**

- `label`: string
- `hint`: string - Helper text
- `error`: string - Error message
- `required`: boolean - Shows asterisk
- `gap`: 'xs' | 'sm' | 'md'
- `children`: ReactNode

---

### 12. Form

Form wrapper with proper submit handling.

**Usage:**

```tsx
import { Form } from '@/components/ui';

<Form onSubmit={(e) => handleSubmit()} gap="md">
  <Input label="Name" />
  <Input label="Email" />
  <Button>Submit</Button>
</Form>;
```

**Props:**

- `onSubmit`: (event: FormEvent) => void
- `gap`: Spacing between fields
- All Mantine Stack props

---

## Complete Form Example

```tsx
import {
  Form,
  FormField,
  Input,
  Select,
  Textarea,
  Checkbox,
  Button,
} from '@/components/ui';
import { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    agree: false,
  });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField label="Full Name" required>
        <Input
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </FormField>

      <FormField label="Email" required>
        <Input
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </FormField>

      <FormField label="Subject" required>
        <Select
          placeholder="Select subject"
          data={['General', 'Support', 'Sales']}
          value={formData.subject}
          onChange={(value) =>
            setFormData({ ...formData, subject: value || '' })
          }
        />
      </FormField>

      <FormField label="Message" required>
        <Textarea
          placeholder="Type your message..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
      </FormField>

      <FormField>
        <Checkbox
          label="I agree to the privacy policy"
          checked={formData.agree}
          onChange={(e) =>
            setFormData({ ...formData, agree: e.target.checked })
          }
        />
      </FormField>

      <Button variant="primary">Submit</Button>
    </Form>
  );
}
```

---

## Form Validation Example

```tsx
import { Form, FormField, Input, Button } from '@/components/ui';
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Login:', { email, password });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField label="Email" error={errors.email} required>
        <Input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>

      <FormField label="Password" error={errors.password} required>
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      <Button variant="primary">Login</Button>
    </Form>
  );
}
```

---

## Styling & Variants

All form components support:

- **Variants**: default, filled, unstyled
- **Sizes**: xs, sm, md, lg, xl (where applicable)
- **States**: disabled, error, loading
- **Custom styling**: Via `style` or `className` props

---

## Accessibility

All components include:

- ✅ Proper ARIA labels
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Error announcements
- ✅ Required field indicators
