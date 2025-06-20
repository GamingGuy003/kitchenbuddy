import { Text } from "react-native";
import { IngredientAmount } from "../types/ingredient";
import { useState } from "react";

const AmountSelector = ({amountChange}: {amountChange: () => void}) => {
    // initialize to default value
    const [amount, setAmount] = useState<IngredientAmount>({ kind: 'Count', value: 1});
    
    return <Text>{amount.value}{ amount.kind === 'Custom' ? amount.unit : null }</Text>
}

export default AmountSelector;