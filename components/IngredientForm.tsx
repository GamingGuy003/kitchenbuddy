import { EXPIRY_ESTIMATES, ExpiryEstimate, CATEGORIES, LOCATIONS, CONFECTIONS } from '../constants/ingredientProperties';
import { IngredientData } from '../types/ingredient'; // Assuming IngredientData is the type for form data
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface IngredientFormProps {
    initialValues?: Partial<IngredientData>;
    onSubmit: (data: IngredientData) => void;
    submitButtonTitle: string;
}

export default function IngredientForm({ initialValues, onSubmit, submitButtonTitle }: IngredientFormProps) {
    const [name, setName] = useState(initialValues?.name || '');
    const [category, setCategory] = useState(initialValues?.category);
    const [location, setLocation] = useState(initialValues?.location);
    const [confectionType, setConfectionType] = useState(initialValues?.confectionType);
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(initialValues?.expirationDate ? new Date(initialValues.expirationDate) : undefined);
    const [brand, setBrand] = useState<string | undefined>(initialValues?.brand)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        // Update form if initialValues change
        if (initialValues) {
            setName(initialValues.name || '');
            setCategory(initialValues.category || '');
            setLocation(initialValues.location || '');
            setConfectionType(initialValues.confectionType || '');
            setExpirationDate(initialValues.expirationDate ? new Date(initialValues.expirationDate) : undefined);
            setBrand(initialValues.brand || '')
        }
    }, [initialValues]);

    // datepicker mechanics
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirmDate = (date: Date) => {
        setExpirationDate(date);
        hideDatePicker();
    };

    const handleSelectEstimate = (days: number) => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + days);
        setExpirationDate(newDate);
    };

    const handleSubmit = () => {
        onSubmit({
            name,
            category: category || undefined,
            location: location || undefined,
            confectionType: confectionType || undefined,
            expirationDate,
            brand: brand || undefined
        });
    };

    return (
        <KeyboardAwareScrollView>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Name*</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g., Apples" />

                <Text style={styles.label}>Brand</Text>
                <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="e.g., Nestle" />

                <Text style={styles.label}>Category</Text>
                <Picker selectedValue={category} onValueChange={setCategory}>
                    <Picker.Item label="Select Category..." value="" />
                    {CATEGORIES.map(category => <Picker.Item key={category} label={category} value={category} />)}
                </Picker>

                <Text style={styles.label}>Location</Text>
                <Picker selectedValue={location} onValueChange={setLocation}>
                    <Picker.Item label="Select Location..." value="" />
                    {LOCATIONS.map(location => <Picker.Item key={location} label={location} value={location} />)}
                </Picker>

                <Text style={styles.label}>Confection Type</Text>
                <Picker selectedValue={confectionType} onValueChange={setConfectionType}>
                    <Picker.Item label="Select Confection Type..." value="" />
                    {CONFECTIONS.map(confection => <Picker.Item key={confection} label={confection} value={confection} />)}
                </Picker>

                <Text style={styles.label}>Expiration Date</Text>
                <Button title={expirationDate ? `Selected: ${expirationDate.toLocaleDateString()}` : "Pick Exact Date"} onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    date={expirationDate || new Date()}
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                    minimumDate={new Date()}
                />

                <Text style={styles.estimateLabel}>Or Estimate Expiry:</Text>
                <View style={styles.estimateButtonsContainer}>
                    {EXPIRY_ESTIMATES.map((estimate: ExpiryEstimate) => (
                        <View key={estimate.label} style={styles.estimateButton}>
                            <Button title={estimate.label} onPress={() => handleSelectEstimate(estimate.days)} />
                        </View>
                    ))}
                </View>

                <View style={styles.submitButtonContainer}>
                    <Button title={submitButtonTitle} onPress={handleSubmit} />
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        height: 40 
    },
    estimateLabel: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 16
    },
    estimateButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 20
    },
    estimateButton: {
        margin: 5
    },
    submitButtonContainer: {
        marginTop: 20
    },
});