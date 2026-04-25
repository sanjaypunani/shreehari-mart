# Task: Category Ordering — Admin UI (Frontend)

## Objective

Replace the `DataTable` on the admin Categories page with a drag-and-drop sortable list. After this task the full feature is live end-to-end: the admin can reorder categories via drag-and-drop or keyboard, the order persists to the database, and the storefront reflects the change automatically (no storefront code changes required).

## Target Files

- `shreehari-mart/package.json` — modify — add `@dnd-kit/core` and `@dnd-kit/sortable` to `dependencies` (the admin app uses the monorepo root `package.json`; there is no separate `apps/admin/package.json`)
- `apps/admin/src/components/categories/DnDStatusBanner.tsx` — create — conditional `Alert` shown when search is active and DnD is disabled
- `apps/admin/src/components/categories/DragHandle.tsx` — create — `ActionIcon` with grip icon; handles disabled state and ARIA attributes
- `apps/admin/src/components/categories/CategoryRowSnapshot.tsx` — create — stateless ghost row rendered inside `DragOverlay` during an active drag
- `apps/admin/src/components/categories/SortableCategoryRow.tsx` — create — single row wrapped with `useSortable()`; renders all data cells and action buttons
- `apps/admin/src/components/categories/SortableCategoryList.tsx` — create — core DnD list; owns `DndContext`, `SortableContext`, `DragOverlay`, and all optimistic state
- `apps/admin/src/pages/CategoriesPage.tsx` — modify — remove `DataTable`, add `useReorderCategories`, derive `isDndDisabled`, render new components

The directory `apps/admin/src/components/categories/` does not currently exist and must be created.

## Implementation Steps

1. **Install dnd-kit dependencies**

   Add to the `dependencies` section of `shreehari-mart/package.json`:

   ```json
   "@dnd-kit/core": "^6.x",
   "@dnd-kit/sortable": "^8.x"
   ```

   Then run `npm install` from `shreehari-mart/`. `@dnd-kit/utilities` (which provides `CSS.Transform.toString`) is a peer dependency of `@dnd-kit/sortable` and will be installed automatically.

2. **Create `DnDStatusBanner.tsx`**

   File: `apps/admin/src/components/categories/DnDStatusBanner.tsx`

   Props: `visible: boolean`

   - Renders `null` when `visible` is `false`.
   - When `visible` is `true`, renders a Mantine `Alert` with:
     - `variant="light"`
     - `color="yellow"`
     - `title="Reordering unavailable"`
     - `icon={<IconInfoCircle size={16} />}` (from `@tabler/icons-react`, already installed)
     - Message text: `"Clear the search field to drag and reorder categories."`

3. **Create `DragHandle.tsx`**

   File: `apps/admin/src/components/categories/DragHandle.tsx`

   Props:
   ```typescript
   interface DragHandleProps {
     disabled: boolean;
     listeners?: SyntheticListenerMap | undefined;
     attributes?: DraggableAttributes;
   }
   ```

   Renders a Mantine `ActionIcon` (variant="subtle", color="gray", size="sm") containing `IconGripVertical` (size 18, color gray.5) from `@tabler/icons-react`.

   **When `disabled` is `false` (normal state):**
   - Spread `{...listeners}` and `{...attributes}` onto the `ActionIcon`
   - `aria-label="Drag to reorder"`
   - `aria-describedby="category-list-keyboard-hint"`
   - `style={{ cursor: 'grab' }}`

   **When `disabled` is `true`:**
   - Do NOT spread `listeners` or `attributes` — omitting them prevents drag activation
   - `aria-disabled="true"`
   - `aria-label="Drag to reorder (unavailable while searching)"`
   - `aria-describedby="category-list-keyboard-hint"`
   - `style={{ opacity: 0.35, cursor: 'not-allowed', pointerEvents: 'none' }}`

   Import types: `SyntheticListenerMap` from `@dnd-kit/core`, `DraggableAttributes` from `@dnd-kit/core`.

4. **Create `CategoryRowSnapshot.tsx`**

   File: `apps/admin/src/components/categories/CategoryRowSnapshot.tsx`

   Props: `category: CategoryDto` (from `@shreehari/types`)

   This is a stateless visual clone rendered inside `DragOverlay` during an active drag. It must not use `useSortable()` or any dnd-kit hooks.

   Render the same horizontal `Group` (align="center", gap="md") as a normal row:
   - Image thumbnail (48×48, radius="sm")
   - Category name: `Text` size="sm" fw={500}
   - Product count: `Badge` variant="outline"
   - Edit `ActionIcon` (visually present, no `onClick`)
   - Delete `ActionIcon` (visually present, no `onClick`)

   Do not render `category.slug` — that field does not exist on the entity.

   Apply ghost row styling: white background, Mantine `shadows.md` box shadow, `borderRadius: 8px`.

5. **Create `SortableCategoryRow.tsx`**

   File: `apps/admin/src/components/categories/SortableCategoryRow.tsx`

   Props:
   ```typescript
   interface SortableCategoryRowProps {
     category: CategoryDto;
     isDndDisabled: boolean;
     isSaving: boolean;
     onEdit: () => void;
     onDelete: () => void;
   }
   ```

   Uses `useSortable({ id: category.id })` from `@dnd-kit/sortable`.

   Apply drag transform styles on the row container:
   ```typescript
   style={{
     transform: CSS.Transform.toString(transform),
     transition,
   }}
   ```

   When `isDragging` (i.e., this row's `id === activeId`), apply placeholder styles on the row container:
   - `backgroundColor: 'var(--mantine-color-gray-1)'` (gray.1, approximately #f5f5f5)
   - `border: '1px dashed var(--mantine-color-gray-3)'`
   - Inner content opacity: 0.4

   Set `role="listitem"` on the row container element.

   Render children in order:
   1. `DragHandle` with `disabled={isDndDisabled || isSaving}`, `listeners`, `attributes` from `useSortable`
   2. Image thumbnail (48×48, radius="sm")
   3. Category name: `Text` size="sm" fw={500} with flex grow
   4. Product count: `Badge` variant="outline"
   5. Edit `ActionIcon` (calls `onEdit` on click)
   6. Delete `ActionIcon` with `disabled={isSaving}` (calls `onDelete` on click)

   Add a horizontal `Divider` (color="gray.2") below the row (do not render after the last row).

6. **Create `SortableCategoryList.tsx`**

   File: `apps/admin/src/components/categories/SortableCategoryList.tsx`

   Props:
   ```typescript
   interface SortableCategoryListProps {
     categories: CategoryDto[];
     onReorder: (ids: string[]) => Promise<void>;
     loading: boolean;
     isDndDisabled: boolean;
     onEdit: (id: string) => void;
     onDelete: (category: CategoryDto) => void;
   }
   ```

   **Local state:**
   ```typescript
   const [localOrder, setLocalOrder] = useState<CategoryDto[]>(categories);
   const [preReorderSnapshot, setPreReorderSnapshot] = useState<CategoryDto[]>([]);
   const [activeId, setActiveId] = useState<string | null>(null);
   const [isSaving, setIsSaving] = useState(false);
   ```

   **Sync effect** (prevents background refetch from overwriting in-flight optimistic update):
   ```typescript
   useEffect(() => {
     if (activeId === null && !isSaving) {
       setLocalOrder(categories);
     }
   }, [categories, activeId, isSaving]);
   ```

   **Sensor configuration:**
   ```typescript
   const activeSensors = useSensors(
     useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
   );
   const disabledSensors = useSensors(); // empty — no drag initiation allowed

   // Pass to DndContext:
   sensors={isDndDisabled || isSaving ? disabledSensors : activeSensors}
   ```

   The `distance: 8` activation constraint on `PointerSensor` prevents accidental drags when the user intends a click on the Edit or Delete action icons.

   **`onDragStart` handler:**
   ```typescript
   const handleDragStart = (event: DragStartEvent) => {
     setActiveId(event.active.id as string);
   };
   ```

   **`onDragEnd` handler:**
   ```typescript
   const handleDragEnd = async (event: DragEndEvent) => {
     const { active, over } = event;
     setActiveId(null);

     // No-op: dropped outside a droppable area or on the same position
     if (over === null || active.id === over.id) return;

     const oldIndex = localOrder.findIndex((c) => c.id === active.id);
     const newIndex = localOrder.findIndex((c) => c.id === over.id);

     const snapshot = [...localOrder];
     setPreReorderSnapshot(snapshot);

     const newOrder = arrayMove(localOrder, oldIndex, newIndex);
     setLocalOrder(newOrder);   // optimistic update
     setIsSaving(true);

     try {
       await onReorder(newOrder.map((c) => c.id));
       setPreReorderSnapshot([]);
     } catch (err) {
       // Rollback
       setLocalOrder(snapshot);
       setPreReorderSnapshot([]);

       const message = err instanceof Error ? err.message : '';
       const isStaleList = message.includes('does not match') || message.includes('non-empty');

       notifications.show({
         title: 'Reorder failed',
         message: isStaleList
           ? 'Category list has changed. Please refresh the page and try again.'
           : 'Could not save the new order. The list has been restored.',
         color: 'red',
         autoClose: 5000,
       });
     } finally {
       setIsSaving(false);
     }
   };
   ```

   **Rendered structure** inside the component return:

   ```tsx
   <Card shadow="sm" padding="lg" radius="md" withBorder style={{ position: 'relative' }}>
     <LoadingOverlay visible={loading || isSaving} />

     <VisuallyHidden id="category-list-keyboard-hint">
       Press Space or Enter to pick up an item, use arrow keys to move it, and press
       Space or Enter again to drop it. Press Escape to cancel.
     </VisuallyHidden>

     <DndContext
       sensors={isDndDisabled || isSaving ? disabledSensors : activeSensors}
       collisionDetection={closestCenter}
       onDragStart={handleDragStart}
       onDragEnd={handleDragEnd}
     >
       <SortableContext
         items={localOrder.map((c) => c.id)}
         strategy={verticalListSortingStrategy}
       >
         <div
           role="list"
           aria-label="Categories list, drag to reorder"
           aria-describedby="category-list-keyboard-hint"
         >
           {localOrder.map((category) => (
             <SortableCategoryRow
               key={category.id}
               category={category}
               isDndDisabled={isDndDisabled}
               isSaving={isSaving}
               onEdit={() => onEdit(category.id)}
               onDelete={() => onDelete(category)}
             />
           ))}
         </div>
       </SortableContext>

       <DragOverlay>
         {activeId
           ? <CategoryRowSnapshot
               category={localOrder.find((c) => c.id === activeId)!}
             />
           : null
         }
       </DragOverlay>
     </DndContext>
   </Card>
   ```

   Required imports: `DndContext`, `DragOverlay`, `closestCenter`, `DragStartEvent`, `DragEndEvent`, `useSensors`, `useSensor`, `PointerSensor`, `KeyboardSensor` from `@dnd-kit/core`; `SortableContext`, `verticalListSortingStrategy`, `arrayMove`, `sortableKeyboardCoordinates` from `@dnd-kit/sortable`; `notifications` from `@mantine/notifications`.

7. **Update `CategoriesPage.tsx`**

   File: `apps/admin/src/pages/CategoriesPage.tsx`

   **Add imports:**
   ```typescript
   import { useReorderCategories } from '@shreehari/data-access';
   import { DnDStatusBanner } from '../components/categories/DnDStatusBanner';
   import { SortableCategoryList } from '../components/categories/SortableCategoryList';
   ```

   **Remove imports:**
   - `DataTable`, `Column`, `DataTableAction` from `@shreehari/ui` (remove only if not used elsewhere on the page)

   **Add hook call** (alongside existing hook calls):
   ```typescript
   const { reorderCategories, loading: reorderLoading } = useReorderCategories();
   ```

   **Add derived value** (after existing `searchValue` state):
   ```typescript
   const isDndDisabled = searchValue.trim() !== '';
   ```

   **Add `handleReorder` callback:**
   ```typescript
   const handleReorder = async (ids: string[]) => {
     await reorderCategories({ ids });
     refetch();
   };
   ```

   Note: `refetch()` is already returned by `useCategories()` in the existing code. `refetch()` is called only on success (after `await`) — on error, `reorderCategories` throws and `SortableCategoryList` handles the rollback internally.

   **Remove** the `columns` array definition and the `actions` array definition that currently feed into `DataTable`.

   **Replace** `<DataTable ... />` with:
   ```tsx
   <DnDStatusBanner visible={isDndDisabled} />
   <SortableCategoryList
     categories={filteredCategories}
     onReorder={handleReorder}
     loading={loading || deleteLoading || reorderLoading}
     isDndDisabled={isDndDisabled}
     onEdit={(id) => navigate(`/categories/${id}/edit`)}
     onDelete={handleDeleteCategory}
   />
   ```

   **Leave unchanged:** `PageHeader`, `SearchFilter`, `handleDeleteCategory`, error state rendering, navigation to `/categories/new`, `filteredCategories` derivation logic.

## Reference Documents

- Design Doc: `shreehari-mart/docs/design/category-ordering-frontend-design.md` (Sections 2–10)
- UI Spec: `shreehari-mart/docs/ui-spec/category-ordering-ui-spec.md` (Sections 1–9)

## Acceptance Criteria

| AC ID | Criterion |
|-------|-----------|
| AC-AD-1 | Categories page renders a reorderable list (not a DataTable) when no search is active |
| AC-AD-2 | Dragging a row updates the displayed order immediately (optimistic update) |
| AC-AD-3 | After a successful drag-and-drop, refreshing the page shows the same order |
| AC-AD-4 | On API failure, the list reverts to its pre-drag order and a "Reorder failed" error toast appears |
| AC-AD-5 | When search is active, drag handles appear disabled and dragging has no effect |
| AC-AD-6 | Disabled drag handles carry `aria-disabled="true"` |
| AC-AD-7 | The list is keyboard-reorderable via Space + arrow keys |
| AC-WEB-1 | After admin reorders, the storefront category list reflects the new order (no code change to `apps/web`) |
| AC-WEB-2 | The storefront `CategorySidebar` reflects the new order (no code change to `apps/web`) |
| NFR-A-1 | `KeyboardSensor` with `sortableKeyboardCoordinates` is configured and not disabled when DnD is enabled |
| NFR-A-2 | `VisuallyHidden` keyboard instructions are present with `id="category-list-keyboard-hint"` and referenced via `aria-describedby` on the list container and each `DragHandle` |
| NFR-A-3 | `DragHandle` has an accessible `aria-label` in both normal and disabled states |
| NFR-A-4 | Disabled drag handles communicate state to screen readers via `aria-disabled="true"` |
| NFR-R-2 | Displayed order never permanently diverges from the persisted order — optimistic rollback fires on any API failure |

**E2E tests to pass** (skeleton in `apps/web-e2e/src/category-reorder.e2e.ts`):

All 11 test cases in the `Category drag-and-drop reorder — Admin Dashboard` suite, covering: drag handle visibility, drag-to-persist, optimistic update, error rollback, DnD-disabled-when-searching (3 tests), and ARIA attribute verification (3 tests).

## Dependencies

- `category-ordering-backend-task-1` must be complete — entity and repository changes provide the correct sort order on `GET /api/categories`.
- `category-ordering-backend-task-2` must be complete — `useReorderCategories` hook must be exported from `@shreehari/data-access`; `ReorderCategoriesDto` and updated `CategoryDto` (with `sortOrder: number`) must be present in `@shreehari/types`.
