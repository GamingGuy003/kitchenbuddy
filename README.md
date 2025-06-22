## Kitchen buddy big brain app

- [app](#app)
    - [ingredient-details](#ingredient-details)
        - [[id].tsx](#ingredient-detailsid)
    - [item-details](#item-details)
        - [[id].tsx](#item-detailsid)
    - [_layout.tsx](#_layout)
    - [shops](#shops)
        - [addShop.tsx](#shopsaddshop)
        - [_layout.tsx](#shops_layout)
        - [listShops.tsx](#shopslistshops)
    - [(tabs)](#tabs)
        - [add.tsx](#tabsadd)
        - [expiringSoon.tsx](#tabsexpiringsoon)
        - [groceryList.tsx](#tabsgrocerylist)
        - [layout.tsx](#tabs_layout)
        - [queries.tsx](#tabsqueries)
        - [scan.tsx](#tabsqueries)

## app

### ingredient-details

#### ingredient-details/id

### item-details

#### item-details/id

### _layout

### shops

#### shops/addShop

#### shops/_layout

#### shops/listShops

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