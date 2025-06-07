import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export const List = ({content}:{content: string[]}) => {
    const [selected, setSelected] = useState<string|null>(null);

    return (
        <View>
            { selected ? 
                <Pressable onPress={() => setSelected(null)}>
                    <Text>Selected: {selected}</Text>
                </Pressable>
                :
                content.map((item: string) => (
                    <ListElement content={item} onPress={() => setSelected(item)}/>
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