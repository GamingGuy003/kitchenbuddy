import { CameraView, useCameraPermissions } from 'expo-camera';
import { ReactNode, useState } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import CommonStyles from '../../constants/commonStyle';

// Define a type for the product data we expect (can be expanded)
interface ProductInfo {
  product_name?: string;
  brands?: string;
  categories?: string;
  image_url?: string; // Standard image URL
  image_front_url?: string; // Often a more specific front image
  image_small_url?: string; // Sometimes a smaller version is available
  // Add other fields you might want to use from the API response
}

export default function ScanScreen(): ReactNode {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={CommonStyles.pageContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const fetchProductDetails = async (barcode: string) => {
    setIsLoading(true);
    setApiError(null);
    setProductInfo(null); // Clear previous product info

    try {
      // Using OpenFoodFacts API v2. You can also try v0 or v3.
      // Example: https://world.openfoodfacts.org/api/v2/product/3017620422003.json
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);

      const jsonResponse = await response.json();

      if (!response.ok) {
        setApiError(jsonResponse.status_verbose || `HTTP error! Status: ${response.status}`);
        return;
      }

      if (jsonResponse.status === 1 && jsonResponse.product) {
        setProductInfo(jsonResponse.product);
      } else if (jsonResponse.status === 0) {
        setApiError(`Product with barcode ${barcode} not found.`);
        setScannedData(null); // Allow re-scanning if product not found
        setProductInfo(null);
      } else {
        setApiError('Product data not in expected format.');
        setScannedData(null); // Allow re-scanning
        setProductInfo(null);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      setApiError(error instanceof Error ? error.message : 'An unknown error occurred.');
      setScannedData(null); // Allow re-scanning on error
      setProductInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarcodeScanned = ({ data }: { type: string, data: string }) => {
    // Avoid re-fetching if data is already being processed or product info is shown
    if (isLoading || productInfo) return;

    setScannedData(data); // Set scanned data to stop further scans immediately
    console.log(`Barcode scanned: ${data}`);
    fetchProductDetails(data);
  };

  const handleAddIngredient = () => {
    if (productInfo) {
      router.push({
        pathname: '/(tabs)/add',
        params: {
          name: productInfo.product_name,
          brand: productInfo.brands,
          // You can pass more params like category if needed
          // category: productInfo.categories,
        },
      });
      // Reset state for next scan
      handleRescan();
    }
  };

  const handleRescan = () => {
    setScannedData(null);
    setProductInfo(null);
    setApiError(null);
    setIsLoading(false); // Ensure loading is also reset
  };

  return (
    <View style={{...CommonStyles.pageContainer, flex: 1, justifyContent: 'center' }}>
      {!productInfo && !isLoading && !apiError && (
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"], // Added more common types
          }}
          onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned}
        />
      )}

      {isLoading && (
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading product details...</Text>
        </View>
      )}

      {apiError && !isLoading && (
        <View style={styles.centeredContent}>
          <Text style={styles.errorText}>Error: {apiError}</Text>
          <Button title="Scan Again" onPress={handleRescan} />
        </View>
      )}

      {productInfo && !isLoading && (
        <View style={styles.centeredContent}>
          { (productInfo.image_front_url || productInfo.image_url || productInfo.image_small_url) && (
            <Image
              style={styles.productImage}
              source={{ uri: productInfo.image_front_url || productInfo.image_url || productInfo.image_small_url }}
              resizeMode="contain" // Or "cover", "stretch", etc.
            />
          )}
          <Text style={styles.productName}>{productInfo.product_name || 'N/A'}</Text>
          {productInfo.brands && <Text>Brand: {productInfo.brands}</Text>}
          <View style={styles.buttonGroup}>
            <Button title="Add as Ingredient" onPress={handleAddIngredient} />
            <Button title="Scan Another Item" onPress={handleRescan} color="grey" />
          </View>
        </View>
      )}
      {/* Display the raw scanned barcode if no product info yet, for debugging/confirmation */}
      {scannedData && !productInfo && !isLoading && !apiError && (
         <Text style={styles.scannedDataText}>Scanned: {scannedData}. Fetching...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  scannedDataText: {
    textAlign: 'center',
    color: 'black',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
    width: '80%', // Adjust as needed
  },
  productImage: {
    maxWidth: '80%',
    minWidth: '80%',
    aspectRatio: 1,
    marginBottom: 15,
  }
});
