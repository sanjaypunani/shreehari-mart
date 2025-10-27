'use client';

import {
  Container,
  Stack,
  Paper,
  Group,
  Box,
  SimpleGrid,
  RangeSlider,
} from '@mantine/core';
import { useState } from 'react';
import {
  Text,
  Heading,
  Paragraph,
  Button,
  IconButton,
  LinkButton,
  LoadingButton,
  Icon,
  IconWrapper,
  Avatar,
  AvatarGroup,
  Badge,
  Chip,
  Divider,
  // Form Components
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
  FormField,
  Form,
  // Navigation Components
  Breadcrumb,
  Tabs,
  Pagination,
  DropdownMenu,
  SidebarMenu,
  Stepper,
  NavLink,
  // Data Display Components
  Table,
  DataList,
  Accordion,
  TagList,
  Timeline,
  MetricCard,
  EmptyState,
  Image,
  AvatarList,
  Carousel,
  // Feedback Components
  Alert,
  toast,
  Modal,
  Dialog,
  ConfirmDialog,
  Tooltip,
  Popover,
  ProgressBar,
  CircularProgress,
  Spinner,
  LoaderOverlay,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonWrapper,
} from '../../components/ui';
import { colors } from '../../theme';

export default function ThemePage() {
  // Form state
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string | null>('tab1');
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Heading order={1}>Design System Showcase</Heading>
          <Paragraph variant="secondary">
            Complete showcase of all core UI components with their variants
          </Paragraph>
        </Box>

        {/* Typography Section */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Typography</Heading>
            <Divider />

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Headings
              </Text>
              <Stack gap="md">
                <Heading order={1}>Heading 1 - Main Page Title</Heading>
                <Heading order={2}>Heading 2 - Section Title</Heading>
                <Heading order={3}>Heading 3 - Subsection Title</Heading>
                <Heading order={4}>Heading 4 - Card Title</Heading>
                <Heading order={5}>Heading 5 - Small Heading</Heading>
                <Heading order={6}>Heading 6 - Tiny Heading</Heading>
              </Stack>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Text Variants
              </Text>
              <Stack gap="sm">
                <Text variant="primary">Primary text - Default text color</Text>
                <Text variant="secondary">
                  Secondary text - Muted text color
                </Text>
                <Text
                  variant="inverse"
                  style={{
                    backgroundColor: colors.primary,
                    padding: '8px',
                    borderRadius: '4px',
                  }}
                >
                  Inverse text - Light text on dark background
                </Text>
              </Stack>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Paragraph
              </Text>
              <Paragraph>
                This is a paragraph component with relaxed line height for
                better readability. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </Paragraph>
              <Paragraph variant="secondary" mt="sm">
                This is a secondary paragraph with muted color. Perfect for
                supporting text and descriptions that need less visual emphasis.
              </Paragraph>
            </Box>
          </Stack>
        </Paper>

        {/* Buttons Section */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Buttons</Heading>
            <Divider />

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Button Variants
              </Text>
              <Group gap="md">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Button Sizes
              </Text>
              <Group gap="md" align="center">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Loading Buttons
              </Text>
              <Group gap="md">
                <LoadingButton variant="primary" loading>
                  Loading...
                </LoadingButton>
                <LoadingButton variant="outline" loading>
                  Processing
                </LoadingButton>
                <LoadingButton variant="primary">Not Loading</LoadingButton>
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Icon Buttons
              </Text>
              <Group gap="md">
                <IconButton variant="primary">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                  </svg>
                </IconButton>
                <IconButton variant="secondary">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M12.146 4.146a.5.5 0 0 1 .708.708L8.707 9l4.147 4.146a.5.5 0 0 1-.708.708L8 9.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 9 3.146 4.854a.5.5 0 1 1 .708-.708L8 8.293l4.146-4.147z" />
                  </svg>
                </IconButton>
                <IconButton variant="outline">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" />
                  </svg>
                </IconButton>
                <IconButton variant="ghost">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M2 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
                  </svg>
                </IconButton>
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Link Buttons
              </Text>
              <Group gap="md">
                <LinkButton variant="primary">Primary Link</LinkButton>
                <LinkButton variant="secondary">Secondary Link</LinkButton>
              </Group>
            </Box>
          </Stack>
        </Paper>

        {/* Icons Section */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Icons</Heading>
            <Divider />

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Icon Sizes
              </Text>
              <Group gap="md" align="center">
                <Icon size={16}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" />
                  </svg>
                </Icon>
                <Icon size={24}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" />
                  </svg>
                </Icon>
                <Icon size={32}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" />
                  </svg>
                </Icon>
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Icon Wrappers
              </Text>
              <Group gap="md">
                <IconWrapper variant="primary">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" />
                  </svg>
                </IconWrapper>
                <IconWrapper variant="secondary">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" />
                  </svg>
                </IconWrapper>
                <IconWrapper variant="outline">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" />
                  </svg>
                </IconWrapper>
              </Group>
            </Box>
          </Stack>
        </Paper>

        {/* Avatars Section */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Avatars</Heading>
            <Divider />

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Avatar Sizes
              </Text>
              <Group gap="md" align="center">
                <Avatar name="John Doe" size="sm" />
                <Avatar name="Jane Smith" size="md" />
                <Avatar name="Bob Johnson" size="lg" />
                <Avatar name="Alice Williams" size="xl" />
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Avatar with Images
              </Text>
              <Group gap="md" align="center">
                <Avatar name="User 1" src="https://i.pravatar.cc/150?img=1" />
                <Avatar name="User 2" src="https://i.pravatar.cc/150?img=2" />
                <Avatar name="User 3" src="https://i.pravatar.cc/150?img=3" />
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Avatar Group
              </Text>
              <AvatarGroup
                avatars={[
                  { name: 'John Doe', src: 'https://i.pravatar.cc/150?img=1' },
                  {
                    name: 'Jane Smith',
                    src: 'https://i.pravatar.cc/150?img=2',
                  },
                  { name: 'Bob Johnson' },
                  { name: 'Alice Williams' },
                  { name: 'Charlie Brown' },
                ]}
                max={3}
              />
            </Box>
          </Stack>
        </Paper>

        {/* Badges & Chips Section */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Badges & Tags</Heading>
            <Divider />

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Badge Variants
              </Text>
              <Group gap="md">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="outline">Outline</Badge>
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Badge Sizes
              </Text>
              <Group gap="md" align="center">
                <Badge size="xs">Extra Small</Badge>
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
                <Badge size="xl">Extra Large</Badge>
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Chips (Light Variants)
              </Text>
              <Group gap="md">
                <Chip variant="primary">Primary Chip</Chip>
                <Chip variant="secondary">Secondary Chip</Chip>
                <Chip variant="success">Success Chip</Chip>
                <Chip variant="error">Error Chip</Chip>
                <Chip variant="warning">Warning Chip</Chip>
                <Chip variant="outline">Outline Chip</Chip>
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Removable Chips
              </Text>
              <Group gap="md">
                <Chip
                  variant="primary"
                  removable
                  onRemove={() => console.log('Removed')}
                >
                  Removable
                </Chip>
                <Chip
                  variant="success"
                  removable
                  onRemove={() => console.log('Removed')}
                >
                  Click X to remove
                </Chip>
                <Chip
                  variant="error"
                  removable
                  onRemove={() => console.log('Removed')}
                >
                  Tag 1
                </Chip>
              </Group>
            </Box>
          </Stack>
        </Paper>

        {/* Divider Section */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Dividers</Heading>
            <Divider />

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Divider Variants
              </Text>
              <Stack gap="lg">
                <Box>
                  <Text size="xs" mb="xs" c={colors.text.secondary}>
                    Solid
                  </Text>
                  <Divider variant="solid" />
                </Box>
                <Box>
                  <Text size="xs" mb="xs" c={colors.text.secondary}>
                    Dashed
                  </Text>
                  <Divider variant="dashed" />
                </Box>
                <Box>
                  <Text size="xs" mb="xs" c={colors.text.secondary}>
                    Dotted
                  </Text>
                  <Divider variant="dotted" />
                </Box>
              </Stack>
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Divider with Label
              </Text>
              <Divider label="Section Break" labelPosition="center" />
            </Box>

            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Vertical Divider
              </Text>
              <Group gap="md">
                <Text>Item 1</Text>
                <Divider orientation="vertical" />
                <Text>Item 2</Text>
                <Divider orientation="vertical" />
                <Text>Item 3</Text>
              </Group>
            </Box>
          </Stack>
        </Paper>

        {/* Color Palette */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Color Palette</Heading>
            <Divider />

            <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
              <Box>
                <Box
                  style={{
                    backgroundColor: colors.primary,
                    height: '80px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                />
                <Text size="sm" fw={600}>
                  Primary
                </Text>
                <Text size="xs" c={colors.text.secondary}>
                  {colors.primary}
                </Text>
              </Box>
              <Box>
                <Box
                  style={{
                    backgroundColor: colors.secondary,
                    height: '80px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                />
                <Text size="sm" fw={600}>
                  Secondary
                </Text>
                <Text size="xs" c={colors.text.secondary}>
                  {colors.secondary}
                </Text>
              </Box>
              <Box>
                <Box
                  style={{
                    backgroundColor: colors.success,
                    height: '80px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                />
                <Text size="sm" fw={600}>
                  Success
                </Text>
                <Text size="xs" c={colors.text.secondary}>
                  {colors.success}
                </Text>
              </Box>
              <Box>
                <Box
                  style={{
                    backgroundColor: colors.error,
                    height: '80px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                />
                <Text size="sm" fw={600}>
                  Error
                </Text>
                <Text size="xs" c={colors.text.secondary}>
                  {colors.error}
                </Text>
              </Box>
              <Box>
                <Box
                  style={{
                    backgroundColor: colors.warning,
                    height: '80px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                />
                <Text size="sm" fw={600}>
                  Warning
                </Text>
                <Text size="xs" c={colors.text.secondary}>
                  {colors.warning}
                </Text>
              </Box>
              <Box>
                <Box
                  style={{
                    backgroundColor: colors.surface,
                    height: '80px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    border: `1px solid ${colors.border}`,
                  }}
                />
                <Text size="sm" fw={600}>
                  Surface
                </Text>
                <Text size="xs" c={colors.text.secondary}>
                  {colors.surface}
                </Text>
              </Box>
            </SimpleGrid>
          </Stack>
        </Paper>

        {/* Form Components Section */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Form Components</Heading>
            <Divider />

            {/* Input Fields */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Input Fields
              </Text>
              <Stack gap="md">
                <Input
                  label="Default Input"
                  placeholder="Enter text..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.currentTarget.value)}
                />
                <Input
                  label="Input with Icon"
                  placeholder="Search..."
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  }
                />
                <Input
                  label="Filled Variant"
                  variant="filled"
                  placeholder="Filled input..."
                />
                <Input
                  label="Disabled Input"
                  placeholder="Cannot edit"
                  disabled
                />
                <Input
                  label="Input with Error"
                  placeholder="Enter email..."
                  error="Invalid email format"
                />
              </Stack>
            </Box>

            {/* Search Input */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Search Input
              </Text>
              <SearchInput
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.currentTarget.value)}
                onSearch={(value) => console.log('Searching for:', value)}
              />
            </Box>

            {/* Textarea */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Textarea
              </Text>
              <Stack gap="md">
                <Textarea
                  label="Default Textarea"
                  placeholder="Enter description..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.currentTarget.value)}
                />
                <Textarea
                  label="Filled Textarea"
                  variant="filled"
                  placeholder="Your comments..."
                  minRows={4}
                />
              </Stack>
            </Box>

            {/* Select */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Select
              </Text>
              <Stack gap="md">
                <Select
                  label="Category"
                  placeholder="Select a category"
                  value={selectValue}
                  onChange={setSelectValue}
                  data={[
                    { value: 'electronics', label: 'Electronics' },
                    { value: 'clothing', label: 'Clothing' },
                    { value: 'food', label: 'Food & Beverages' },
                    { value: 'home', label: 'Home & Garden' },
                  ]}
                />
                <Select
                  label="Filled Select"
                  variant="filled"
                  placeholder="Choose an option"
                  data={['Option 1', 'Option 2', 'Option 3']}
                />
              </Stack>
            </Box>

            {/* Checkbox */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Checkbox
              </Text>
              <Stack gap="sm">
                <Checkbox
                  label="I agree to the terms and conditions"
                  checked={checkboxValue}
                  onChange={(e) => setCheckboxValue(e.currentTarget.checked)}
                />
                <Checkbox
                  label="Subscribe to newsletter"
                  description="Get weekly updates about new products"
                />
                <Checkbox label="Disabled checkbox" disabled />
                <Checkbox label="Checked and disabled" checked disabled />
              </Stack>
            </Box>

            {/* Radio Group */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Radio Group
              </Text>
              <RadioGroup
                label="Delivery Method"
                description="Choose your preferred delivery option"
                value={radioValue}
                onChange={setRadioValue}
                options={[
                  {
                    value: 'standard',
                    label: 'Standard Delivery',
                    description: '5-7 business days',
                  },
                  {
                    value: 'express',
                    label: 'Express Delivery',
                    description: '2-3 business days',
                  },
                  {
                    value: 'overnight',
                    label: 'Overnight Delivery',
                    description: 'Next day delivery',
                  },
                  {
                    value: 'pickup',
                    label: 'Store Pickup',
                    description: 'Pick up from nearest store',
                    disabled: true,
                  },
                ]}
              />
            </Box>

            {/* Switch */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Switch
              </Text>
              <Stack gap="sm">
                <Switch
                  label="Enable notifications"
                  checked={switchValue}
                  onChange={(e) => setSwitchValue(e.currentTarget.checked)}
                />
                <Switch label="Dark mode" description="Enable dark theme" />
                <Switch label="Disabled switch" disabled />
              </Stack>
            </Box>

            {/* Slider */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Slider
              </Text>
              <Stack gap="md">
                <div>
                  <Text size="sm" mb="xs">
                    Volume: {sliderValue}%
                  </Text>
                  <Slider
                    value={sliderValue}
                    onChange={setSliderValue}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' },
                    ]}
                  />
                </div>
                <div>
                  <Text size="sm" mb="xs">
                    Price Range
                  </Text>
                  <RangeSlider
                    defaultValue={[20, 80]}
                    minRange={10}
                    min={0}
                    max={100}
                    step={5}
                    color="primary"
                  />
                </div>
              </Stack>
            </Box>

            {/* Date Picker */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Date Picker
              </Text>
              <Stack gap="md">
                <DatePicker
                  label="Select Date"
                  placeholder="Pick a date"
                  value={dateValue}
                  onChange={(value) => setDateValue(value as Date | null)}
                />
                <DatePicker
                  label="Filled Date Picker"
                  variant="filled"
                  placeholder="Choose date"
                />
              </Stack>
            </Box>

            {/* File Upload */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                File Upload
              </Text>
              <Stack gap="md">
                <FileUpload
                  label="Upload Image"
                  placeholder="Choose file..."
                  accept="image/*"
                  showPreview
                />
                <FileUpload
                  label="Upload Document"
                  placeholder="Select document..."
                  accept=".pdf,.doc,.docx"
                />
              </Stack>
            </Box>

            {/* Form Field Wrapper */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Form Field with Label & Error
              </Text>
              <Stack gap="md">
                <FormField
                  label="Username"
                  hint="Choose a unique username"
                  required
                >
                  <Input placeholder="Enter username" />
                </FormField>
                <FormField
                  label="Email"
                  error="This email is already taken"
                  required
                >
                  <Input placeholder="Enter email" />
                </FormField>
              </Stack>
            </Box>

            {/* Complete Form Example */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Complete Form Example
              </Text>
              <Paper withBorder p="md" radius="md">
                <Form onSubmit={(e) => console.log('Form submitted')}>
                  <Heading order={4}>Contact Form</Heading>

                  <FormField label="Full Name" required>
                    <Input placeholder="John Doe" />
                  </FormField>

                  <FormField label="Email" required>
                    <Input type="email" placeholder="john@example.com" />
                  </FormField>

                  <FormField label="Phone">
                    <Input type="tel" placeholder="+1 234 567 8900" />
                  </FormField>

                  <FormField label="Subject" required>
                    <Select
                      placeholder="Select subject"
                      data={['General Inquiry', 'Support', 'Sales', 'Other']}
                    />
                  </FormField>

                  <FormField label="Message" required>
                    <Textarea
                      placeholder="Type your message here..."
                      minRows={4}
                    />
                  </FormField>

                  <FormField>
                    <Checkbox label="I agree to the privacy policy" />
                  </FormField>

                  <Group gap="sm" mt="md">
                    <Button variant="primary">Submit</Button>
                    <Button variant="outline">Cancel</Button>
                  </Group>
                </Form>
              </Paper>
            </Box>
          </Stack>
        </Paper>

        {/* Navigation Components Section */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Navigation Components</Heading>
            <Divider />

            {/* Breadcrumb */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Breadcrumb
              </Text>
              <Stack gap="md">
                <Breadcrumb
                  items={[
                    { label: 'Home', href: '/' },
                    { label: 'Products', href: '/products' },
                    { label: 'Electronics', href: '/products/electronics' },
                    { label: 'Laptop' },
                  ]}
                />
                <Breadcrumb
                  items={[
                    {
                      label: 'Dashboard',
                      href: '/',
                      icon: (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 0L0 6v10h16V6L8 0zm6 15H2V6.5L8 1.5 14 6.5V15z" />
                        </svg>
                      ),
                    },
                    { label: 'Settings', href: '/settings' },
                    { label: 'Profile' },
                  ]}
                  separator="›"
                />
              </Stack>
            </Box>

            {/* Tabs */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Tabs
              </Text>
              <Stack gap="md">
                <Tabs
                  value={activeTab}
                  onChange={setActiveTab}
                  variant="default"
                  items={[
                    {
                      value: 'tab1',
                      label: 'Overview',
                      content: <Text>Overview content goes here</Text>,
                    },
                    {
                      value: 'tab2',
                      label: 'Analytics',
                      content: <Text>Analytics content goes here</Text>,
                    },
                    {
                      value: 'tab3',
                      label: 'Reports',
                      content: <Text>Reports content goes here</Text>,
                    },
                  ]}
                />

                <Tabs
                  variant="pills"
                  defaultValue="pill1"
                  items={[
                    {
                      value: 'pill1',
                      label: 'All',
                      icon: (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                        </svg>
                      ),
                    },
                    { value: 'pill2', label: 'Active' },
                    { value: 'pill3', label: 'Inactive', disabled: true },
                  ]}
                />
              </Stack>
            </Box>

            {/* Pagination */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Pagination
              </Text>
              <Stack gap="md">
                <Pagination
                  total={10}
                  value={currentPage}
                  onChange={setCurrentPage}
                />
                <Pagination
                  total={20}
                  siblings={1}
                  boundaries={1}
                  defaultValue={5}
                  size="sm"
                />
              </Stack>
            </Box>

            {/* Dropdown Menu */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Dropdown Menu
              </Text>
              <Group gap="md">
                <DropdownMenu
                  label="Actions"
                  items={[
                    {
                      label: 'Edit',
                      icon: (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 2.793L10.5 3 1.5 12v2.293L3.793 12.5l8.5-8.5z" />
                        </svg>
                      ),
                      onClick: () => console.log('Edit'),
                    },
                    {
                      label: 'Duplicate',
                      icon: (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2z" />
                        </svg>
                      ),
                      onClick: () => console.log('Duplicate'),
                    },
                    { divider: true },
                    {
                      label: 'Delete',
                      color: 'red',
                      icon: (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        </svg>
                      ),
                      onClick: () => console.log('Delete'),
                    },
                  ]}
                />

                <DropdownMenu
                  trigger={
                    <IconButton variant="outline">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                      </svg>
                    </IconButton>
                  }
                  items={[
                    {
                      label: 'Settings',
                      onClick: () => console.log('Settings'),
                    },
                    { label: 'Help', onClick: () => console.log('Help') },
                    { label: 'Logout', onClick: () => console.log('Logout') },
                  ]}
                />
              </Group>
            </Box>

            {/* Sidebar Menu */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Sidebar Menu
              </Text>
              <Paper
                withBorder
                p="md"
                radius="md"
                style={{ maxWidth: '300px' }}
              >
                <SidebarMenu
                  items={[
                    {
                      label: 'Dashboard',
                      icon: (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 0L0 6v10h16V6L8 0zm6 15H2V6.5L8 1.5 14 6.5V15z" />
                        </svg>
                      ),
                      active: true,
                    },
                    {
                      label: 'Products',
                      icon: (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2z" />
                        </svg>
                      ),
                      badge: 12,
                      children: [
                        { label: 'All Products', href: '/products' },
                        { label: 'Categories', href: '/categories' },
                        { label: 'Inventory', href: '/inventory' },
                      ],
                    },
                    {
                      label: 'Orders',
                      icon: (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5z" />
                        </svg>
                      ),
                      badge: 5,
                    },
                    {
                      label: 'Customers',
                      icon: (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                        </svg>
                      ),
                    },
                    {
                      label: 'Settings',
                      icon: (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492z" />
                        </svg>
                      ),
                      children: [
                        { label: 'General', href: '/settings/general' },
                        { label: 'Security', href: '/settings/security' },
                        {
                          label: 'Notifications',
                          href: '/settings/notifications',
                        },
                      ],
                    },
                  ]}
                />
              </Paper>
            </Box>

            {/* NavLink */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Nav Links
              </Text>
              <Stack gap="xs" style={{ maxWidth: '300px' }}>
                <NavLink
                  label="Home"
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 0L0 6v10h16V6L8 0zm6 15H2V6.5L8 1.5 14 6.5V15z" />
                    </svg>
                  }
                  active
                />
                <NavLink
                  label="Notifications"
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z" />
                    </svg>
                  }
                  badge={3}
                />
                <NavLink
                  label="Messages"
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z" />
                    </svg>
                  }
                  badge="99+"
                />
              </Stack>
            </Box>

            {/* Stepper */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Stepper
              </Text>
              <Stepper
                active={activeStep}
                onStepClick={setActiveStep}
                steps={[
                  {
                    label: 'Account Info',
                    description: 'Enter your details',
                    content: (
                      <Text>Step 1: Fill in your account information</Text>
                    ),
                  },
                  {
                    label: 'Preferences',
                    description: 'Choose your settings',
                    content: <Text>Step 2: Set your preferences</Text>,
                  },
                  {
                    label: 'Review',
                    description: 'Review and confirm',
                    content: <Text>Step 3: Review your information</Text>,
                  },
                ]}
              />
              <Group gap="sm" mt="md">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setActiveStep(Math.min(2, activeStep + 1))}
                  disabled={activeStep === 2}
                >
                  Next
                </Button>
              </Group>
            </Box>
          </Stack>
        </Paper>

        {/* Data Display Components Section */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Data Display Components</Heading>
            <Divider />

            {/* Table */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Table
              </Text>
              <Table
                columns={[
                  { key: 'id', label: 'ID', width: 80 },
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge variant={value === 'active' ? 'success' : 'error'}>
                        {value}
                      </Badge>
                    ),
                  },
                  { key: 'role', label: 'Role', align: 'center' },
                ]}
                data={[
                  {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    status: 'active',
                    role: 'Admin',
                  },
                  {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    status: 'active',
                    role: 'User',
                  },
                  {
                    id: 3,
                    name: 'Bob Johnson',
                    email: 'bob@example.com',
                    status: 'inactive',
                    role: 'User',
                  },
                ]}
                striped
                highlightOnHover
              />
            </Box>

            {/* DataList */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Data List
              </Text>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <Paper withBorder p="md" radius="md">
                  <Text size="sm" fw={600} mb="md">
                    Horizontal Layout
                  </Text>
                  <DataList
                    items={[
                      { label: 'Full Name', value: 'John Doe' },
                      { label: 'Email', value: 'john@example.com' },
                      { label: 'Phone', value: '+1 234 567 8900' },
                      { label: 'Location', value: 'New York, USA' },
                      {
                        label: 'Status',
                        value: <Badge variant="success">Active</Badge>,
                      },
                    ]}
                    orientation="horizontal"
                  />
                </Paper>
                <Paper withBorder p="md" radius="md">
                  <Text size="sm" fw={600} mb="md">
                    Vertical Layout
                  </Text>
                  <DataList
                    items={[
                      { label: 'Product Name', value: 'Premium Widget' },
                      { label: 'SKU', value: 'WID-001-BLU' },
                      { label: 'Price', value: '$49.99' },
                      { label: 'Stock', value: '127 units' },
                    ]}
                    orientation="vertical"
                    striped
                  />
                </Paper>
              </SimpleGrid>
            </Box>

            {/* Accordion */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Accordion
              </Text>
              <Accordion
                items={[
                  {
                    value: 'item-1',
                    label: 'What is Shreehari Mart?',
                    content:
                      'Shreehari Mart is a comprehensive order management system designed to help businesses manage their inventory, orders, and customer relationships efficiently.',
                  },
                  {
                    value: 'item-2',
                    label: 'How do I get started?',
                    content:
                      'Getting started is easy! Simply sign up for an account, configure your store settings, and start adding products to your inventory.',
                  },
                  {
                    value: 'item-3',
                    label: 'What features are included?',
                    content: (
                      <Stack gap="xs">
                        <Text>• Inventory Management</Text>
                        <Text>• Order Processing</Text>
                        <Text>• Customer Management</Text>
                        <Text>• Analytics & Reporting</Text>
                        <Text>• Multi-user Support</Text>
                      </Stack>
                    ),
                  },
                ]}
                variant="separated"
              />
            </Box>

            {/* TagList */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Tag List
              </Text>
              <Stack gap="md">
                <Box>
                  <Text size="xs" mb="xs" c={colors.text.secondary}>
                    Simple Tags
                  </Text>
                  <TagList
                    tags={[
                      'Electronics',
                      'Gadgets',
                      'Smartphones',
                      'Accessories',
                      'Technology',
                    ]}
                    variant="primary"
                  />
                </Box>
                <Box>
                  <Text size="xs" mb="xs" c={colors.text.secondary}>
                    Removable Tags
                  </Text>
                  <TagList
                    tags={[
                      'JavaScript',
                      'TypeScript',
                      'React',
                      'Next.js',
                      'Node.js',
                    ]}
                    variant="success"
                    removable
                    onRemove={(tag) => console.log('Removed:', tag)}
                  />
                </Box>
              </Stack>
            </Box>

            {/* Timeline */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Timeline
              </Text>
              <Timeline
                items={[
                  {
                    title: 'Order Placed',
                    description: 'Customer placed an order for 3 items',
                    timestamp: '2 hours ago',
                    color: 'blue',
                  },
                  {
                    title: 'Payment Confirmed',
                    description: 'Payment of $149.97 received successfully',
                    timestamp: '1 hour ago',
                    color: 'green',
                  },
                  {
                    title: 'Order Packed',
                    description: 'Order has been packed and ready for shipping',
                    timestamp: '30 minutes ago',
                    color: 'yellow',
                  },
                  {
                    title: 'Out for Delivery',
                    description: 'Order is out for delivery',
                    timestamp: 'Just now',
                    color: 'primary',
                  },
                ]}
              />
            </Box>

            {/* MetricCard */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Metric Cards
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                <MetricCard
                  label="Total Revenue"
                  value="$45,231"
                  variant="primary"
                  trend={{
                    value: 12.5,
                    direction: 'up',
                    label: 'vs last month',
                  }}
                  icon={
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                    </svg>
                  }
                />
                <MetricCard
                  label="Total Orders"
                  value="1,234"
                  variant="success"
                  trend={{ value: 8.2, direction: 'up', label: 'this week' }}
                  icon={
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5z" />
                    </svg>
                  }
                />
                <MetricCard
                  label="New Customers"
                  value="342"
                  variant="warning"
                  trend={{
                    value: 3.1,
                    direction: 'down',
                    label: 'vs last week',
                  }}
                  icon={
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                    </svg>
                  }
                />
                <MetricCard
                  label="Pending Orders"
                  value="23"
                  variant="error"
                  description="Requires immediate attention"
                  icon={
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    </svg>
                  }
                />
              </SimpleGrid>
            </Box>

            {/* EmptyState */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Empty State
              </Text>
              <Paper withBorder radius="md">
                <EmptyState
                  icon={
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                  }
                  title="No products found"
                  description="Get started by adding your first product to the inventory."
                  action={{
                    label: 'Add Product',
                    onClick: () => console.log('Add product clicked'),
                    variant: 'primary',
                  }}
                />
              </Paper>
            </Box>

            {/* Image */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Image Component
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                <Box>
                  <Text size="xs" mb="xs" c={colors.text.secondary}>
                    Cover (Default)
                  </Text>
                  <Image
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
                    alt="Mountain landscape"
                    height={200}
                    fit="cover"
                  />
                </Box>
                <Box>
                  <Text size="xs" mb="xs" c={colors.text.secondary}>
                    Contain
                  </Text>
                  <Image
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
                    alt="Mountain landscape"
                    height={200}
                    fit="contain"
                    style={{ backgroundColor: colors.surface }}
                  />
                </Box>
                <Box>
                  <Text size="xs" mb="xs" c={colors.text.secondary}>
                    With Placeholder
                  </Text>
                  <Image
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
                    alt="Mountain landscape"
                    height={200}
                    withPlaceholder
                  />
                </Box>
              </SimpleGrid>
            </Box>

            {/* AvatarList */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Avatar List
              </Text>
              <Stack gap="md">
                <Box>
                  <Text size="xs" mb="xs" c={colors.text.secondary}>
                    Small Team (5 max)
                  </Text>
                  <AvatarList
                    avatars={[
                      {
                        name: 'Alice Johnson',
                        src: 'https://i.pravatar.cc/150?img=1',
                      },
                      {
                        name: 'Bob Smith',
                        src: 'https://i.pravatar.cc/150?img=2',
                      },
                      {
                        name: 'Carol Williams',
                        src: 'https://i.pravatar.cc/150?img=3',
                      },
                      { name: 'David Brown' },
                    ]}
                    max={5}
                  />
                </Box>
                <Box>
                  <Text size="xs" mb="xs" c={colors.text.secondary}>
                    Large Team (3 max)
                  </Text>
                  <AvatarList
                    avatars={[
                      {
                        name: 'User 1',
                        src: 'https://i.pravatar.cc/150?img=11',
                      },
                      {
                        name: 'User 2',
                        src: 'https://i.pravatar.cc/150?img=12',
                      },
                      {
                        name: 'User 3',
                        src: 'https://i.pravatar.cc/150?img=13',
                      },
                      { name: 'User 4' },
                      { name: 'User 5' },
                      { name: 'User 6' },
                      { name: 'User 7' },
                    ]}
                    max={3}
                    size="lg"
                  />
                </Box>
              </Stack>
            </Box>

            {/* Carousel */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Carousel / Slider
              </Text>
              <Carousel
                slides={[
                  {
                    content: (
                      <Box
                        style={{
                          height: '100%',
                          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                        }}
                      >
                        <Stack align="center" gap="sm">
                          <Heading order={3} style={{ color: 'white' }}>
                            Slide 1
                          </Heading>
                          <Text style={{ color: 'white' }}>
                            Welcome to the carousel component
                          </Text>
                        </Stack>
                      </Box>
                    ),
                  },
                  {
                    content: (
                      <Box
                        style={{
                          height: '100%',
                          background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.primary} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                        }}
                      >
                        <Stack align="center" gap="sm">
                          <Heading order={3} style={{ color: 'white' }}>
                            Slide 2
                          </Heading>
                          <Text style={{ color: 'white' }}>
                            Swipe or use arrows to navigate
                          </Text>
                        </Stack>
                      </Box>
                    ),
                  },
                  {
                    content: (
                      <Box
                        style={{
                          height: '100%',
                          background: `linear-gradient(135deg, ${colors.warning} 0%, ${colors.error} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                        }}
                      >
                        <Stack align="center" gap="sm">
                          <Heading order={3} style={{ color: 'white' }}>
                            Slide 3
                          </Heading>
                          <Text style={{ color: 'white' }}>
                            Perfect for showcasing content
                          </Text>
                        </Stack>
                      </Box>
                    ),
                  },
                ]}
                height={300}
              />
            </Box>
          </Stack>
        </Paper>

        {/* Feedback Components Section */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Heading order={2}>Feedback Components</Heading>
            <Divider />

            {/* Alert */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Alert Messages
              </Text>
              <Stack gap="md">
                <Alert variant="info" title="Information">
                  This is an informational message to keep you updated.
                </Alert>
                <Alert variant="success" title="Success" withCloseButton>
                  Your changes have been saved successfully!
                </Alert>
                <Alert variant="warning" title="Warning">
                  Please review the following items before proceeding.
                </Alert>
                <Alert variant="error" title="Error" withCloseButton>
                  An error occurred while processing your request.
                </Alert>
              </Stack>
            </Box>

            {/* Toast/Notifications */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Toast Notifications
              </Text>
              <Group gap="md">
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.info('This is an info notification', 'Information')
                  }
                >
                  Show Info Toast
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.success(
                      'Operation completed successfully!',
                      'Success'
                    )
                  }
                >
                  Show Success Toast
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.warning(
                      'Please be careful with this action',
                      'Warning'
                    )
                  }
                >
                  Show Warning Toast
                </Button>
                <Button
                  variant="primary"
                  onClick={() => toast.error('Something went wrong', 'Error')}
                >
                  Show Error Toast
                </Button>
              </Group>
            </Box>

            {/* Modal/Dialog */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Modal & Dialog
              </Text>
              <Group gap="md">
                <Button
                  variant="primary"
                  onClick={() => {
                    const [isOpen, setIsOpen] = [true, (val: boolean) => {}];
                    toast.info(
                      'Modal would open here. Check the modal showcase for interactive example.'
                    );
                  }}
                >
                  Open Modal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.info('Confirmation dialog would open here.');
                  }}
                >
                  Open Confirm Dialog
                </Button>
              </Group>
              <Text size="xs" c={colors.text.secondary} mt="xs">
                Note: Modal components require state management. See component
                documentation for implementation details.
              </Text>
            </Box>

            {/* Tooltip */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Tooltips
              </Text>
              <Group gap="md">
                <Tooltip label="This is a simple tooltip">
                  <Button variant="outline">Hover me</Button>
                </Tooltip>
                <Tooltip
                  label="Tooltip on the right"
                  position="right"
                  withArrow
                >
                  <Button variant="outline">Right tooltip</Button>
                </Tooltip>
                <Tooltip
                  label="This is a multiline tooltip with more detailed information that wraps to multiple lines"
                  multiline
                  width={220}
                >
                  <Button variant="outline">Multiline tooltip</Button>
                </Tooltip>
              </Group>
            </Box>

            {/* Popover */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Popover
              </Text>
              <Group gap="md">
                <Popover
                  trigger={<Button variant="outline">Click for popover</Button>}
                  content={
                    <Stack gap="xs" p="sm">
                      <Text fw={600}>Popover Content</Text>
                      <Text size="sm">
                        This is custom content inside a popover. You can put any
                        React components here.
                      </Text>
                      <Button size="xs" variant="primary">
                        Action Button
                      </Button>
                    </Stack>
                  }
                  width={300}
                />
                <Popover
                  trigger={<Button variant="outline">Bottom popover</Button>}
                  content={
                    <Box p="md">
                      <Text>Content positioned at bottom</Text>
                    </Box>
                  }
                  position="bottom"
                />
              </Group>
            </Box>

            {/* Progress Bars */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Progress Bars
              </Text>
              <Stack gap="md">
                <ProgressBar value={30} label="Default Progress" showValue />
                <ProgressBar
                  value={65}
                  label="Primary Progress"
                  variant="primary"
                  showValue
                />
                <ProgressBar
                  value={85}
                  label="Success Progress"
                  variant="success"
                  showValue
                />
                <ProgressBar
                  value={45}
                  label="Warning Progress"
                  variant="warning"
                  showValue
                />
                <ProgressBar
                  value={20}
                  label="Error Progress"
                  variant="error"
                  showValue
                />
                <ProgressBar
                  value={70}
                  label="Striped & Animated"
                  variant="primary"
                  showValue
                  striped
                  animated
                />
              </Stack>
            </Box>

            {/* Circular Progress */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Circular Progress
              </Text>
              <Group gap="xl">
                <CircularProgress
                  value={75}
                  label="Completion"
                  variant="primary"
                />
                <CircularProgress
                  value={100}
                  label="Complete"
                  variant="success"
                  size={100}
                />
                <CircularProgress
                  value={45}
                  label="In Progress"
                  variant="warning"
                  size={100}
                />
                <CircularProgress
                  value={25}
                  label="Low"
                  variant="error"
                  size={100}
                />
              </Group>
            </Box>

            {/* Spinner/Loader */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Spinners & Loaders
              </Text>
              <Stack gap="md">
                <Group gap="xl" align="center">
                  <Spinner size="xs" />
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Spinner size="xl" />
                </Group>
                <Divider />
                <Spinner size="lg" label="Loading..." />
              </Stack>
            </Box>

            {/* Skeleton Loaders */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Skeleton Loaders
              </Text>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <Paper withBorder p="md" radius="md">
                  <Text size="sm" fw={600} mb="md">
                    Text Skeleton
                  </Text>
                  <SkeletonText lines={4} />
                </Paper>
                <Paper withBorder p="md" radius="md">
                  <Text size="sm" fw={600} mb="md">
                    Card Skeleton
                  </Text>
                  <SkeletonCard />
                </Paper>
              </SimpleGrid>
            </Box>

            {/* Skeleton Wrapper Example */}
            <Box>
              <Text size="sm" fw={600} mb="sm" c={colors.text.secondary}>
                Skeleton Wrapper (Toggle Loading)
              </Text>
              <Paper withBorder p="md" radius="md">
                <Group gap="md" mb="md">
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => {
                      toast.info('Toggle loading state to see skeleton');
                    }}
                  >
                    Toggle Loading
                  </Button>
                </Group>
                <SkeletonWrapper loading={false}>
                  <Stack gap="sm">
                    <Text fw={600}>Loaded Content</Text>
                    <Text size="sm" c={colors.text.secondary}>
                      This content is shown when loading is false. When loading
                      is true, it will be replaced with a skeleton placeholder.
                    </Text>
                  </Stack>
                </SkeletonWrapper>
              </Paper>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
