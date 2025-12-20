# Frontend Components

Documentation for reusable React components in LegumeSec.

## Component Library

All reusable components are located in `components/common/`.

## Loading Components

### Loading

Simple loading spinner component.

**File:** `components/common/Loading.jsx`

```javascript
import Loading from '../components/common/Loading';

// Basic usage
<Loading />

// With message
<Loading message="Chargement des données..." />

// Full screen
<Loading fullScreen message="Chargement..." />

// Overlay
<Loading fullScreen overlay message="Enregistrement..." />
```

**Props:**
- `message` (string) - Loading message
- `size` (number) - Spinner size (default: 40)
- `fullScreen` (boolean) - Full screen overlay
- `overlay` (boolean) - Show overlay background

### SkeletonLoader

Skeleton loaders for different layouts.

**File:** `components/common/SkeletonLoader.jsx`

```javascript
import SkeletonLoader from '../components/common/SkeletonLoader';

// Table skeleton
<SkeletonLoader.Table rows={5} columns={4} />

// Card skeleton
<SkeletonLoader.Card count={3} />

// List skeleton
<SkeletonLoader.List items={5} />

// Form skeleton
<SkeletonLoader.Form />
```

## Form Components

### FormField

Enhanced form field with validation.

**File:** `components/common/FormField.jsx`

```javascript
import FormField from '../components/common/FormField';

<FormField
  label="Email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
  type="email"
  maxLength={100}
  showCharCount
/>
```

**Props:**
- `label` (string) - Field label
- `name` (string) - Field name
- `value` (any) - Field value
- `onChange` (function) - Change handler
- `error` (string) - Error message
- `helperText` (string) - Help text
- `type` (string) - Input type (text, email, password, etc.)
- `required` (boolean) - Required field
- `disabled` (boolean) - Disabled state
- `maxLength` (number) - Maximum length
- `showCharCount` (boolean) - Show character counter
- `multiline` (boolean) - Textarea mode
- `rows` (number) - Textarea rows

### FormModal

Reusable modal for forms.

**File:** `components/common/FormModal.jsx`

```javascript
import FormModal from '../components/common/FormModal';

<FormModal
  open={open}
  onClose={() => setOpen(false)}
  title="Ajouter un agriculteur"
  onSubmit={handleSubmit}
  submitLabel="Enregistrer"
  cancelLabel="Annuler"
>
  <FormField label="Nom" name="nom" value={nom} onChange={handleChange} />
  {/* More fields */}
</FormModal>
```

**Props:**
- `open` (boolean) - Modal open state
- `onClose` (function) - Close handler
- `title` (string) - Modal title
- `onSubmit` (function) - Form submit handler
- `submitLabel` (string) - Submit button text
- `cancelLabel` (string) - Cancel button text
- `maxWidth` (string) - Modal max width (xs, sm, md, lg, xl)
- `showActions` (boolean) - Show action buttons

### ConfirmDialog

Confirmation dialog for destructive actions.

**File:** `components/common/ConfirmDialog.jsx`

```javascript
import ConfirmDialog from '../components/common/ConfirmDialog';

<ConfirmDialog
  open={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={handleDelete}
  title="Supprimer l'agriculteur"
  message="Cette action est irréversible. Êtes-vous sûr ?"
  confirmText="Supprimer"
  cancelText="Annuler"
  severity="error"
/>
```

**Props:**
- `open` (boolean) - Dialog open state
- `onClose` (function) - Close handler
- `onConfirm` (function) - Confirm handler
- `title` (string) - Dialog title
- `message` (string) - Confirmation message
- `confirmText` (string) - Confirm button text
- `cancelText` (string) - Cancel button text
- `severity` (string) - warning, error, or info
- `confirmColor` (string) - Button color

## Data Display Components

### ResponsiveTable

Table that adapts to mobile screens.

**File:** `components/common/ResponsiveTable.jsx`

```javascript
import ResponsiveTable from '../components/common/ResponsiveTable';

const columns = [
  { field: 'nom', label: 'Nom' },
  { field: 'prenom', label: 'Prénom' },
  { field: 'phoneNum', label: 'Téléphone' },
];

<ResponsiveTable
  columns={columns}
  data={agriculteurs}
  emptyMessage="Aucun agriculteur trouvé"
/>
```

**Props:**
- `columns` (array) - Column definitions
- `data` (array) - Table data
- `renderRow` (function) - Custom row renderer
- `emptyMessage` (string) - Empty state message

**Column Definition:**
```javascript
{
  field: 'nom',        // Data field name
  label: 'Nom',        // Column header
  render: (value, row) => value  // Custom renderer (optional)
}
```

### Pagination

Pagination controls component.

**File:** `components/common/Pagination.jsx`

```javascript
import Pagination from '../components/common/Pagination';

<Pagination
  count={totalCount}
  page={currentPage}
  pageSize={pageSize}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
  pageSizeOptions={[10, 20, 50, 100]}
  showPageSize
  showInfo
/>
```

**Props:**
- `count` (number) - Total item count
- `page` (number) - Current page
- `pageSize` (number) - Items per page
- `onPageChange` (function) - Page change handler
- `onPageSizeChange` (function) - Page size change handler
- `pageSizeOptions` (array) - Available page sizes
- `showPageSize` (boolean) - Show page size selector
- `showInfo` (boolean) - Show item count info

## Location Components

### LocationFilter

Reusable location filter component.

**File:** `components/common/LocationFilter.jsx`

```javascript
import LocationFilter from '../components/common/LocationFilter';

<LocationFilter
  onFilterChange={(filters) => {
    // Handle filter changes
    loadFilteredData(filters);
  }}
  disabled={false}
  title="Filtrage par localisation"
/>
```

**Props:**
- `onFilterChange` (function) - Filter change callback
- `disabled` (boolean) - Disable all selects
- `showTitle` (boolean) - Show title
- `title` (string) - Filter title
- `userWilayaId` (number) - Pre-selected wilaya (for agents)

## Image Components

### LazyImage

Lazy-loading image component.

**File:** `components/common/LazyImage.jsx`

```javascript
import LazyImage from '../components/common/LazyImage';

<LazyImage
  src="/path/to/image.jpg"
  alt="Description"
  placeholder={<CircularProgress />}
  style={{ width: '100%', height: '200px' }}
  onLoad={() => console.log('Loaded')}
  onError={() => console.log('Error')}
/>
```

**Props:**
- `src` (string) - Image source URL
- `alt` (string) - Alt text
- `placeholder` (element) - Loading placeholder
- `className` (string) - CSS classes
- `style` (object) - Inline styles
- `onLoad` (function) - Load handler
- `onError` (function) - Error handler

## Button Component

### Button

Button with loading state.

**File:** `components/common/Button.jsx`

```javascript
import Button from '../components/common/Button';

<Button
  loading={isSubmitting}
  onClick={handleSubmit}
  variant="contained"
  color="primary"
>
  Enregistrer
</Button>
```

**Props:**
- `loading` (boolean) - Show loading state
- `disabled` (boolean) - Disabled state
- `variant` (string) - contained, outlined, text
- `color` (string) - primary, secondary, error
- `size` (string) - small, medium, large
- `fullWidth` (boolean) - Full width button
- `startIcon` (element) - Start icon
- `endIcon` (element) - End icon
- `onClick` (function) - Click handler
- `type` (string) - button, submit, reset

## Error Components

### ErrorBoundary

React error boundary component.

**File:** `components/common/ErrorBoundary.jsx`

```javascript
import ErrorBoundary from '../components/common/ErrorBoundary';

<ErrorBoundary
  fallback={(error, reset) => <CustomError onRetry={reset} />}
  showDetails={false}
  showHomeButton
>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `fallback` (function) - Custom error renderer
- `message` (string) - Custom error message
- `showDetails` (boolean) - Show error details
- `showHomeButton` (boolean) - Show home button
- `onReset` (function) - Reset callback

### ErrorDisplay

Error alert component.

**File:** `components/common/ErrorDisplay.jsx`

```javascript
import ErrorDisplay from '../components/common/ErrorDisplay';

<ErrorDisplay
  error={error}
  title="Erreur de chargement"
  message="Impossible de charger les données"
  onRetry={handleRetry}
  retryLabel="Réessayer"
  severity="error"
/>
```

**Props:**
- `error` (object) - Error object
- `title` (string) - Error title
- `message` (string) - Error message
- `onRetry` (function) - Retry handler
- `retryLabel` (string) - Retry button text
- `severity` (string) - error, warning, info

## Toast Notifications

### Toast System

Toast notification system.

**File:** `components/common/Toast.jsx`

```javascript
import { useToast } from '../components/common/Toast';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess('Opération réussie !');
  };

  const handleError = () => {
    showError('Une erreur est survenue');
  };
}
```

**Methods:**
- `showToast(message, severity, duration)` - Generic toast
- `showSuccess(message, duration)` - Success toast
- `showError(message, duration)` - Error toast
- `showWarning(message, duration)` - Warning toast
- `showInfo(message, duration)` - Info toast

## Usage Examples

### Complete Form Example

```javascript
import FormModal from '../components/common/FormModal';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import { useToast } from '../components/common/Toast';

function AgriculteurForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nom: '', prenom: '' });
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await agriculteurService.create(formData);
      showSuccess('Agriculteur créé avec succès');
      setOpen(false);
    } catch (error) {
      showError('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      onClose={() => setOpen(false)}
      title="Ajouter un agriculteur"
      onSubmit={handleSubmit}
    >
      <FormField
        label="Nom"
        name="nom"
        value={formData.nom}
        onChange={(e) => setFormData({...formData, nom: e.target.value})}
        required
      />
      <FormField
        label="Prénom"
        name="prenom"
        value={formData.prenom}
        onChange={(e) => setFormData({...formData, prenom: e.target.value})}
        required
      />
    </FormModal>
  );
}
```

### Table with Pagination

```javascript
import ResponsiveTable from '../components/common/ResponsiveTable';
import Pagination from '../components/common/Pagination';
import usePagination from '../hooks/usePagination';
import Loading from '../components/common/Loading';

function AgriculteursList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { page, pageSize, handlePageChange, handlePageSizeChange } = usePagination();

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await agriculteurService.getAll();
      setData(response.results);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <ResponsiveTable
        columns={[
          { field: 'nom', label: 'Nom' },
          { field: 'prenom', label: 'Prénom' },
        ]}
        data={data}
      />
      <Pagination
        count={data.length}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}
```

## Related Documentation

- [Service Layer](./service-layer.md) - API services
- [UX Patterns](./ux-patterns.md) - Common patterns
- [Styling Guide](./styling.md) - Component styling

---

**Need more examples?** Check [UX Patterns](./ux-patterns.md) for complete examples.









