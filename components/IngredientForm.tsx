import { EXPIRY_ESTIMATES, ExpiryEstimate, CATEGORIES, LOCATIONS, CONFECTIONS, RIPENESS } from '../constants/ingredientProperties';
import { Ingredient, IngredientAmount, IngredientAmountKind, Maturity } from '../types/ingredient'; // Assuming IngredientData is the type for form data
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from 'expo-checkbox';
import Slider from '@react-native-community/slider';
import dayDifference from '../constants/timeDifference';
import CommonStyles from '../constants/commonStyle';

interface IngredientFormProps {
    initialValues?: Partial<Ingredient>;
    onSubmit: (data: Partial<Ingredient>) => void;
    submitButtonTitle: string;
}

export default function IngredientForm({ initialValues, onSubmit, submitButtonTitle }: IngredientFormProps) {
    const [name, setName] = useState<string | undefined>(initialValues?.name);
    const [category, setCategory] = useState<string | undefined>(initialValues?.category);
    const [location, setLocation] = useState<string | undefined>(initialValues?.location);
    const [confectionType, setConfectionType] = useState<string | undefined>(initialValues?.confectionType);
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(initialValues?.expirationDate ? new Date(initialValues.expirationDate) : undefined);
    const [brand, setBrand] = useState<string | undefined>(initialValues?.brand);
    const [open, setOpen] = useState<boolean>(initialValues?.open || false);
    const [maturity, setMaturity] = useState<Maturity>(initialValues?.maturity || { lvl: RIPENESS.NONE, edited: new Date() });
    const [freezeInterval, setFreezeInterval] = useState<number | undefined>(initialValues?.frozen);
    const [amountKind, setAmountKind] = useState<IngredientAmountKind>(initialValues?.amount ? initialValues.amount.kind : IngredientAmountKind.COUNT);
    const [amountValue, setAmountValue] = useState<string>(initialValues?.amount ? initialValues.amount.value : '1');
    const [amountUnit, setAmountUnit] = useState<string | undefined>(initialValues?.amount?.kind === IngredientAmountKind.CUSTOM ? initialValues.amount.unit : undefined);
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

    console.log({ amountKind, amountValue, amountUnit })

    useEffect(() => {
        // Update form if initialValues change
        if (initialValues) {
            setName(initialValues.name);
            setCategory(initialValues.category);
            setLocation(initialValues.location);
            setConfectionType(initialValues.confectionType);
            setExpirationDate(initialValues.expirationDate);
            setBrand(initialValues.brand);
            setOpen(initialValues.open || false);
            setMaturity(initialValues.maturity || { lvl: RIPENESS.NONE, edited: new Date ()});
            setAmountKind(initialValues?.amount ? initialValues.amount.kind : IngredientAmountKind.COUNT);
            setAmountValue(initialValues?.amount ? initialValues.amount.value : '1');
            setAmountUnit(initialValues?.amount?.kind === IngredientAmountKind.CUSTOM ? initialValues.amount.unit : undefined);
            setFreezeInterval(initialValues.frozen);
        }
    }, [initialValues]);

    // datepicker mechanics
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirmDate = (date: Date) => {
        setExpirationDate(date);
        hideDatePicker();
    };

    // adds the estimated amount of days to todays date
    const handleSelectEstimate = (days: number) => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + days);
        setExpirationDate(newDate);
    };

    // convert amount into appropriate instance
    const convertAmount = () => {
        switch (amountKind) {
            case (IngredientAmountKind.COUNT): return{ kind: IngredientAmountKind.COUNT, value: amountValue }
            case (IngredientAmountKind.FRACTION): return{ kind: IngredientAmountKind.FRACTION, value: amountValue }
            case (IngredientAmountKind.CUSTOM): return{ kind: IngredientAmountKind.CUSTOM, value: amountValue, unit: amountUnit }
        }
    }

    const handleSubmit = () => {
        onSubmit({
            name,
            category,
            location,
            confectionType,
            expirationDate,
            brand,
            open: open || false,
            maturity,
            frozen: freezeInterval,
            amount: convertAmount(),
        });
    };

    // converts the enum variants into a readable string
    const getRipenessText = () => {
        return RIPENESS[maturity.lvl].charAt(0) + RIPENESS[maturity.lvl].toLocaleLowerCase().slice(1)
    };

    // when slider moves, modify ripeness as well as edited date
    const setRipenessAndDate = (ripeness: RIPENESS) => {
        setMaturity({ lvl: ripeness, edited: new Date() })
    }

    // save the interval between time of freezing and old expiration date
    const freeze = () => {
        if (!expirationDate) return;
        const diffDays = dayDifference(expirationDate);
        setFreezeInterval(diffDays);
        const newExpiration = new Date(expirationDate);
        newExpiration.setMonth(newExpiration.getMonth() + 6);
        setExpirationDate(newExpiration)
    }

    // adds old interval to current date
    const unfreeze = () => {
        if (!expirationDate || !freezeInterval) return;
        const newExpiration = new Date();
        newExpiration.setDate(newExpiration.getDate() + freezeInterval);
        setExpirationDate(newExpiration);
        setFreezeInterval(undefined);
    }

    const setConfectionTypeFreeze = (confectionType?: string) => {
        unfreeze();
        setConfectionType(confectionType);
    }

    // alert the user that opened products my not last as long
    const handleOpened = (value: boolean) => {
        // notify only if changed from unopen to open
        if (!open && value) Alert.alert('Notice', 'Opened products may not last as long; Possibly adjust expiration date');
        setOpen(value)
    }

    // shows the amount units
    const units = {
        [IngredientAmountKind.COUNT]: <TextInput style={{...CommonStyles.input, textAlign: 'center'}} placeholder="#" editable={false} />,
        [IngredientAmountKind.FRACTION]: <TextInput style={{...CommonStyles.input, textAlign: 'center'}} placeholder="%" editable={false} />,
        [IngredientAmountKind.CUSTOM]: <TextInput style={{...CommonStyles.input, textAlign: 'center'}} value={amountUnit} onChangeText={unit => {setAmountUnit(unit)}} placeholder="e.g., ml" />,
    };

    return (
        <KeyboardAwareScrollView>
            <ScrollView contentContainerStyle={CommonStyles.pageContainer}>
                <View style={CommonStyles.rowView}>
                    <View style={{ flex: 3 }}>
                        <Text style={CommonStyles.label}>Name*</Text>
                        <TextInput style={CommonStyles.input} value={name} onChangeText={setName} placeholder="e.g., Apples" />
                    </View>
                    <View style={styles.checkBoxView}>
                        <Text style={CommonStyles.label}>Open</Text>
                        <CheckBox value={open} onValueChange={handleOpened}/>
                    </View>
                </View>

                <Text style={CommonStyles.label}>Brand</Text>
                <TextInput style={CommonStyles.input} value={brand} onChangeText={setBrand} placeholder="e.g., Nestle" />

                <View style={CommonStyles.rowView}>
                    <View style={{ flex: 8, alignSelf: 'flex-end' }}>
                        <Text style={CommonStyles.label}>Amount</Text>
                        <TextInput style={CommonStyles.input} value={amountValue} onChangeText={setAmountValue} placeholder="e.g., 1" />
                    </View>
                    <View style={{ flex: 2, alignSelf: 'flex-end' }}>
                        <Text style={CommonStyles.label}>Unit</Text>
                        <View style={CommonStyles.rowView}>
                            { units[amountKind] }
                            <Picker selectedValue={amountKind} onValueChange={setAmountKind} placeholder={amountKind} style={{width: 30}}>
                                <Picker.Item key='Count' label='#' value={IngredientAmountKind.COUNT}/>
                                <Picker.Item key='Fraction' label='%' value={IngredientAmountKind.FRACTION}/>
                                <Picker.Item key='Custom' label='...' value={IngredientAmountKind.CUSTOM}/>
                            </Picker>
                        </View>
                    </View>
                </View>

                <Text style={CommonStyles.label}>Ripeness: {getRipenessText()} { dayDifference(maturity.edited) >= 3 ? '(Checking required)' : null}</Text>
                <View style={CommonStyles.rowView}>
                    <Slider step={1} minimumValue={-1} maximumValue={3} value={maturity.lvl} onValueChange={setRipenessAndDate} style={{ flex: 1 }}/>
                    <Button title={`Confirm ${getRipenessText()}`} onPress={() => {
                        setRipenessAndDate(maturity.lvl);
                        Alert.alert('Ripeness confirmed', `Ripeness is still ${getRipenessText()}`);
                    }}/>
                </View>

                <Text style={CommonStyles.label}>Category</Text>
                <Picker selectedValue={category} onValueChange={setCategory}>
                    { !category ? <Picker.Item label="Select Category..."/> : null }
                    {CATEGORIES.map(category => <Picker.Item key={category} label={category} value={category} />)}
                </Picker>

                <Text style={CommonStyles.label}>Location</Text>
                <Picker selectedValue={location} onValueChange={setLocation}>
                    { !location ? <Picker.Item label="Select Location..."/> : null }
                    {LOCATIONS.map(location => <Picker.Item key={location} label={location} value={location} />)}
                </Picker>

                <Text style={CommonStyles.label}>Confection Type</Text>
                <View style={CommonStyles.rowView}>
                    <View style={{ flex: 3 }}>
                        <Picker selectedValue={confectionType} onValueChange={setConfectionTypeFreeze}>
                            { !confectionType ? <Picker.Item label="Select Confection Type..."/> : null }
                            {CONFECTIONS.map(confection => <Picker.Item key={confection} label={confection} value={confection} />)}
                        </Picker>
                    </View>
                    { confectionType === 'Fresh' && expirationDate ?
                    <View style={{flex: 1, marginTop: 10 }}>
                        <Button title={freezeInterval ? 'unfreeze' : 'freeze'} onPress={ freezeInterval ? unfreeze : freeze}/>
                    </View> : null }
                </View>
                
                <Text style={CommonStyles.label}>Expiration Date</Text>
                <Button title={expirationDate ? `Selected: ${expirationDate.toLocaleDateString()}` : "Pick Exact Date"} onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    date={expirationDate || new Date()}
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                    minimumDate={new Date()}
                />

                <Text style={CommonStyles.label}>Or Estimate Expiry:</Text>
                <View style={CommonStyles.rowView}>
                    {EXPIRY_ESTIMATES.map((estimate: ExpiryEstimate) => (
                        <View key={estimate.label} style={styles.estimateButton}>
                            <Button title={estimate.label} onPress={() => handleSelectEstimate(estimate.days)} />
                        </View>
                    ))}
                </View>

                <View style={{ marginTop: 20 }}>
                    <Button title={submitButtonTitle} onPress={handleSubmit} />
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    checkBoxView: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        rowGap: 10
    },
    estimateButton: {
        flex: 1,
    },
});