import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export const List = () => {
    const names: string[] = ["John", "Jack", "Jill", "Bill", "Belle", "Joan", "Bob"];
    const [selected, setSelected] = useState<string|null>(null);

    return (
        <View>
            { selected ? 
                <Pressable onPress={() => setSelected(null)}>
                    <Text>Selected: {selected}</Text>
                </Pressable>
                :
                names.map((item: string) => (
                    <ListElement content={item} onPress={() => setSelected(item)} key={item}/>
                ))
            }
        </View>
    )
}

type onPress = () => void

const ListElement = ({content, onPress}:{content:string, onPress: onPress}) => {
    return (
        <Pressable onPress={() => onPress()}>
            <Text>{content}</Text>
        </Pressable>
    )
}