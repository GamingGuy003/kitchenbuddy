## Kitchen buddy big brain app

Setup and run locally via
```bash
npm install
npx expo start
```

- [app](#app)
    - [ingredient-details](#ingredient-details)
        - [[id]](#ingredient-detailsid)
    - [item-details](#item-details)
        - [[id]](#item-detailsid)
    - [_layout](#_layout)
    - [shops](#shops)
        - [addShop](#shopsaddshop)
        - [_layout](#shops_layout)
        - [listShops](#shopslistshops)
    - [(tabs)](#tabs)
        - [add](#tabsadd)
        - [expiringSoon](#tabsexpiringsoon)
        - [groceryList](#tabsgrocerylist)
        - [layout](#tabs_layout)
        - [queries](#tabsqueries)
        - [scan](#tabsqueries)
- [components](#components)
    - [amountPicker](#amountpicker)
    - [ingredientForm](#ingredientform)
    - [listComponent](#listcomponents)
    - [multiSelectPicker](#multiselectpicker)
    - [renderIngredient](#renderingredient)
    - [renderItem](#renderitem)
- [constants](#constants)
    - [commonStyles](#commonstyles)
    - [ingredientProperties](#ingredientproperties)
    - [timeDifference](#timedifference)
- [context](#context)
    - [GroceryContext](#grocerycontext)
    - [IngredientContext](#ingredientcontext)
    - [ShopContext](#shopcontext)
- [hooks](#hooks)
    - [useShopProximity](#useshopproximity)
- [types](#types)
    - [formLock](#formlock)
    - [grocery](#grocery)
    - [ingredient](#ingredient)
    - [shop](#shop)

## app

Holds the main pages that make up the application

#### ingredient-details/id

Shows the prefilled ingredient form for a specific ingredient. Possibly locks the fields which have already been filled in before that shouldnt be changed afterwards.

```ts
// fetches the id of the requested ingredient via parameters
const { id } = useLocalSearchParams<{ id: string }>();

// holds the fetched ingredient if it could be retrieved
const [ingredient, setIngredient] = useState<Ingredient | null>(null);

// holds a loading boolean to notify frontend when content loads
const [isLoading, setIsLoading] = useState<boolean>(true);

// holds a boolean to tell the frontend when the user is leaving
const [isNavigatingAway, setIsNavigatingAway] = useState<boolean>(false);
```

#### item-details/id

Shows the prefilled ingredient form for items in the grocery list

```ts
// holds a boolean to tell the frontend when the user is leaving
const [isNavigatingAway, setIsNavigatingAway] = useState<boolean>(false);

// holds a loading boolean to notify frontend when content loads
const [isLoading, setIsLoading] = useState<boolean>(true);

// holds the possibly uninitialized grocery list item to be displayedryListItem | undefined;
type GroceryListItem = {
    id: string,
    item: Partial<Ingredient>
}
const [item, setItem] = useState<GroceryListItem | null>();

// fetches the ingredient id to be fetched from params
const { id } = useLocalSearchParams<{ id: string }>();
```

### _layout

Holds the full structure with stack navigation declaration, aswell as a component which checks the current location everytime the app is opened / focused

### shops

Holds subpages that get rendered when listing / adding shops

#### shops/addShop

Renders the form to add a shop

#### shops/_layout

Defines the stack titles for the two shop pages

#### shops/listShops

Renders the list of different shops

### (tabs)

Holds all the different tabs shown on the bottom bar

#### (tabs)/add

Renders the ingredientform, aswell as handles data which might get passed from the barcode scanner

```ts
// can fetch a name, brand and category which might get passed when adding from the barcode scanner
const params = useLocalSearchParams<{ name?: string, brand?: string, category?: string }>();
// holds possibly partially completed ingredient data passed from the barcode scanner via params
const [initialData, setInitialData] = useState<Partial<Ingredient>>({}); 
```

#### (tabs)/expiringSoon

Renders the expiring soon query

```ts
// holds the current search term
const [search, setSearch] = useState<string>('');
// holds the current maximum days for expiration date that we want to show
const [daysThreshold, setDaysThreshold] = useState<number>(0);
```

#### (tabs)/groceryList

Renders the currently added grocery list items

```ts
// the radius in which shops should be considered close by
const [proximityRadiusKm, setProximityRadiusKm] = useState<number>(0.5);

// wheter to filter by neardby shops or show all items
const [filter, setFilter] = useState<'Nearby' | 'All'>(shops.length > 0 ? 'Nearby' : 'All');

// holds location at the time of opening the list, in order to avoid constantly refetching location
const [location, setLocation] = useState<LocationObject | undefined>();
```

#### (tabs)/_layout

This component simply declares anything in this folder to be different tabs of the application

#### (tabs)/queries

Renders the ingredients based on given queries

```ts
// not defined in this file but used by querytype
// determines which filters to enable
type QueryType = "missingData" | "recentlyAdded" | "location" | "category" | "confectionType" | "ripenessCheck" | "all"
const [queryType, setQueryType] = useState<QueryType>('all');

// these types contain all the different values for confections, categories, locations etc
// filter determines if for example we sort by category, which category we actually want to show
type Filter = IngredientCategory | IngredientConfection | IngredientLocation | undefined;
const [filter, setFilter] = useState<Filter>('');

// search field text
const [search, setSearch] = useState<string>('');
```

#### (tabs)/scan

Shows the camera and scans barcodes, aswell as possibly displaying their fetched data

```ts
// holds camera permission
const [permission, requestPermission] = useCameraPermissions();

// holds scanned barcode data
const [scannedData, setScannedData] = useState<string | null>(null);

// holds information about a retrieved product
interface ProductInfo {
  product_name?: string;
  brands?: string;
  categories?: string;
  image_url?: string; // Standard image URL
  image_front_url?: string; // Often a more specific front image
  image_small_url?: string; // Sometimes a smaller version is available
}
const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);

// holds the loading state in order to update content when loading has been completed. this is necessary to tell the frontend when data has appeared
const [isLoading, setIsLoading] = useState<boolean>(false);

// holds a possible api error for display
const [apiError, setApiError] = useState<string | null>(null);
```

## components

Holds a bunch of reused components

### amountPicker

Renders the amountpicker shown in ingredient and item forms. This component lets users input an amount with either percentages, pieces or a custom unit

```ts
AmountPicker({
    // passed callback to modify parent amountKind
    setAmountKind: React.Dispatch<React.SetStateAction<IngredientAmountKind>>,
    // passed callback to modify parent amountValue
    setAmountValue: React.Dispatch<React.SetStateAction<string>>,
    // passed callback to modify parent amountUnit
    setAmountUnit: React.Dispatch<React.SetStateAction<string | undefined>>,
    // passed value to display amountKind
    amountKind: IngredientAmountKind,
    // passed value to display amountValue
    amountValue: string,
    // passed value to display amountUnit
    amountUnit?: string
})
```
### ingredientForm

Renders the ingredient input form used for entering information

```ts
// params
IngredientForm({
    // a possibly partially completed ingredient for prefilling the fields
    initialValues?: Partial<Ingredient>;
    // if date should be modifiable even if it came prefilled
    datePrefilled?: boolean;
    // callback to run if left submit button gets pressed, aswell as title of button
    leftButton: { onSubmit: (data: Partial<Ingredient>) => void; title: string };
    // callback to run if right submit button gets pressed, aswell as title of button. this one is optional and it not present, only left button will be rendered
    rightButton?: { onSubmit: (data: Partial<Ingredient>) => void; title: string }
})

// state

// name of ingredient
const [name, setName] = useState<string | undefined>(initialValues?.name);

// category of ingredient
const [category, setCategory] = useState<string | undefined>(initialValues?.category);

// location of ingredient
const [location, setLocation] = useState<string | undefined>(initialValues?.location);

// confection type of ingredient
const [confectionType, setConfectionType] = useState<string | undefined>(initialValues?.confectionType);

// expiration date of ingredient
const [expirationDate, setExpirationDate] = useState<Date | undefined>(initialValues?.expirationDate ? new Date(initialValues.expirationDate) : undefined);

// brand of ingredient
const [brand, setBrand] = useState<string | undefined>(initialValues?.brand);

// is ingredient open?
const [open, setOpen] = useState<boolean>(initialValues?.open || false);

// maturity of ingredient
const [maturity, setMaturity] = useState<Maturity>(initialValues?.maturity || { lvl: RIPENESS.NONE, edited: new Date() });

// interval of how long the ingredient would be good before freezing, in order to calculate expiration date when unfreezing
const [freezeInterval, setFreezeInterval] = useState<number | undefined>(initialValues?.frozen);

// states to store the amount of an ingredient as explained in the amount picker
const [amountKind, setAmountKind] = useState<IngredientAmountKind>(initialValues?.amount ? initialValues.amount.kind : IngredientAmountKind.COUNT);
const [amountValue, setAmountValue] = useState<string>(initialValues?.amount ? initialValues.amount.value : '1');
const [amountUnit, setAmountUnit] = useState<string | undefined>(initialValues?.amount?.kind === IngredientAmountKind.CUSTOM ? initialValues.amount.unit : undefined);

// whether the datepicker should be rendered
const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

// which fields in the input form to lock as to not allow user editing
const [locks, setLocks] = useState<FormLock>({
    nameLock: initialValues?.name !== undefined,
    brandLock: initialValues?.brand !== undefined,
    categoryLock: initialValues?.category !== undefined,
    confectionLock: initialValues?.confectionType !== undefined,
    dateLock: !datePrefilled && initialValues?.expirationDate !== undefined,
});
```

### listComponents

Holds a bunch of components used in lists

```ts
// text to render when no content can be shown in the list
ListEmpty({text}: {text?: string})

// header for sectionlists with title passed as argument
SectionHeader({section: {title}}: {section: {title: string}})

// vertical spacer between items
ItemSeparator()
```

### multiSelectPicker

Renders a list of checkboxes to select categories a shop might sell

```ts
CustomMultiSelect({
    // possible values that might get selected
    data: string[],
    // values that have been selected
    selectedItems: string[],
    // callback to pass change back to parent when a checkbox state changes
    onSelectionChange: (selectedItems: string[]) => void,
})
```
### renderIngredient

Renders the requested ingredient in lists and possibly hides the maturity warning like in the grocerylist

```ts
renderIngredientItem({
    // item to render
    item: Ingredient,
    // wether to show the maturitywarning if it hasnt been checked in three days
    hideMaturityWarning?: boolean
})
```
### renderItem

Renders items in the grocery list

```ts
RenderItemList({
    // item to render
    item: GroceryListItem
})
```

## constants

Holds a bunch of widely used constants and utility functions

### commonStyles

Holds the styles used across multiple components

### ingredientProperties

Holds the different values ingredient fields may take aswell as the expiration estimates

### timeDifference

Holds a utility function calculating the amount of days between two dates

## context

Holds the different contexts

### groceryContext

Manages storage and modification of the grocerylist

### ingredientContext

Manages storage and modification of ingredients

### shopContext

Manages storage and modification of the shops

## hooks

Holds the proximity hook

### useShopProximity

Holds the functions to calculate the difference between two coordinates aswell as the functionality of fetching the current location and a hook to recheck location when the app switches to the foreground. This allows the app to check wheter it should switch to the grocerylist tab when opened inside a grocerystore

## types

Holds various type definitions

### formLock

The lock used to lock the fields in the ingredientform if already prefilled

### grocery

The definition of the grocerylistitem aswell as the related context

### ingredient

The definition of the ingredient object, utility functions like stringifyAmount which displays the amount type, aswell as different types to define which values some fields take

### shop

The shop type aswell as its related context and the different types of shops that exist