import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CommonStyles from "../constants/commonStyle";
import { IngredientAmountKind } from "../types/ingredient";
import { ReactNode } from "react";

// big brain arguments
export default function AmountPicker(
    {
        setAmountKind,
        setAmountValue,
        setAmountUnit,
        amountKind,
        amountValue,
        amountUnit,
    }: {
        setAmountKind: React.Dispatch<React.SetStateAction<IngredientAmountKind>>,
        setAmountValue: React.Dispatch<React.SetStateAction<string>>,
        setAmountUnit: React.Dispatch<React.SetStateAction<string | undefined>>,
        amountKind: IngredientAmountKind,
        amountValue: string,
        amountUnit?: string
    }): ReactNode {

    // shows the amount units
    const units = {
        [IngredientAmountKind.COUNT]: <TextInput style={{...CommonStyles.inputInactive, textAlign: 'center' }} placeholder="pcs" editable={false} />,
        [IngredientAmountKind.FRACTION]: <TextInput style={{...CommonStyles.inputInactive, textAlign: 'center' }} placeholder="%" editable={false} />,
        [IngredientAmountKind.CUSTOM]: <TextInput style={{...CommonStyles.input, textAlign: 'center' }} value={amountUnit} onChangeText={unit => {setAmountUnit(unit)}} placeholder="e.g., ml" />,
    };

    return (
        <View>
            <View style={{...CommonStyles.rowView, alignItems: 'flex-end' }}>
                <Text style={{...CommonStyles.label, flex: 1 }}>Amount</Text>
                <Text style={{...CommonStyles.label, textAlign: 'right' }}>Unit</Text>
            </View>
            <View style={CommonStyles.rowView}>
                <TextInput style={{...CommonStyles.input, flex: 1 }} value={amountValue} onChangeText={setAmountValue} placeholder="e.g., 1" />
                { units[amountKind] }
                <Picker selectedValue={amountKind} onValueChange={setAmountKind} placeholder={amountKind} style={{width: 30}}>
                    <Picker.Item key='Count' label='Pieces' value={IngredientAmountKind.COUNT}/>
                    <Picker.Item key='Fraction' label='Fraction' value={IngredientAmountKind.FRACTION}/>
                    <Picker.Item key='Custom' label='Custom' value={IngredientAmountKind.CUSTOM}/>
                </Picker>
            </View>
        </View>
    );
}