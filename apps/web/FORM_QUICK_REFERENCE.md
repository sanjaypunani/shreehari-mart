# 📋 Form Components - Quick Reference Card

## Import

```tsx
import {
  Form,
  FormField,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  DatePicker,
  FileUpload,
  SearchInput,
  Button,
} from '@/components/ui';
```

## 1️⃣ Simple Text Input

```tsx
<Input
  label="Email"
  placeholder="Enter email..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

## 2️⃣ Input with Error

```tsx
<FormField label="Email" error="Invalid email" required>
  <Input placeholder="Enter email..." />
</FormField>
```

## 3️⃣ Textarea

```tsx
<Textarea label="Message" placeholder="Your message..." minRows={4} />
```

## 4️⃣ Select/Dropdown

```tsx
<Select
  label="Category"
  placeholder="Choose..."
  data={['Option 1', 'Option 2', 'Option 3']}
  value={value}
  onChange={setValue}
/>
```

## 5️⃣ Checkbox

```tsx
<Checkbox
  label="I agree to terms"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

## 6️⃣ Radio Group

```tsx
<RadioGroup
  label="Choose one"
  value={value}
  onChange={setValue}
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ]}
/>
```

## 7️⃣ Switch/Toggle

```tsx
<Switch
  label="Enable notifications"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

## 8️⃣ Slider

```tsx
<Slider label="Volume" value={volume} onChange={setVolume} min={0} max={100} />
```

## 9️⃣ Date Picker

```tsx
<DatePicker
  label="Select Date"
  placeholder="Pick a date"
  value={date}
  onChange={(value) => setDate(value as Date | null)}
/>
```

## 🔟 File Upload

```tsx
<FileUpload
  label="Upload Image"
  accept="image/*"
  showPreview
  onFileChange={(file) => console.log(file)}
/>
```

## 1️⃣1️⃣ Search Input

```tsx
<SearchInput
  placeholder="Search..."
  onSearch={(value) => performSearch(value)}
/>
```

## 1️⃣2️⃣ Complete Form

```tsx
function MyForm() {
  const handleSubmit = () => {
    console.log('Form submitted!');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField label="Name" required>
        <Input placeholder="John Doe" />
      </FormField>

      <FormField label="Email" required>
        <Input type="email" placeholder="john@example.com" />
      </FormField>

      <FormField label="Category" required>
        <Select
          placeholder="Choose category"
          data={['Electronics', 'Clothing', 'Food']}
        />
      </FormField>

      <FormField label="Message">
        <Textarea placeholder="Your message..." />
      </FormField>

      <FormField>
        <Checkbox label="I agree to terms" />
      </FormField>

      <Button variant="primary">Submit</Button>
    </Form>
  );
}
```

## 💡 Pro Tips

1. **Always wrap inputs with FormField** for labels and errors
2. **Use `required` prop** to show asterisk
3. **Add error messages** via FormField's `error` prop
4. **Use proper input types** (email, tel, password, etc.)
5. **Provide placeholder text** for better UX
6. **Handle validation** before form submission

## 🎨 Variants

Most form components support:

- `variant="default"` - Standard look
- `variant="filled"` - Filled background
- `variant="unstyled"` - No styling

## 📝 Common Patterns

### Login Form

```tsx
<Form onSubmit={handleLogin}>
  <FormField label="Email" required>
    <Input type="email" />
  </FormField>
  <FormField label="Password" required>
    <Input type="password" />
  </FormField>
  <Button variant="primary">Login</Button>
</Form>
```

### Contact Form

```tsx
<Form onSubmit={handleContact}>
  <FormField label="Name" required>
    <Input />
  </FormField>
  <FormField label="Email" required>
    <Input type="email" />
  </FormField>
  <FormField label="Subject" required>
    <Select data={subjects} />
  </FormField>
  <FormField label="Message" required>
    <Textarea />
  </FormField>
  <Button variant="primary">Send</Button>
</Form>
```

### Settings Form

```tsx
<Form onSubmit={handleSave}>
  <Switch label="Email notifications" />
  <Switch label="SMS notifications" />
  <RadioGroup
    label="Theme"
    options={[
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ]}
  />
  <Button variant="primary">Save Settings</Button>
</Form>
```
