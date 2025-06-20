import { Text, View } from "react-native";
import CommonStyles from "../constants/commonStyle";

export const ListEmpty = ({text}: {text?: string}) => {
    return (<Text style={CommonStyles.listEmptyText}>{text || 'No items match your query'}</Text>)
}

export const SectionHeader = ({section: {title}}: {section: {title: string}}) => {
    return (<Text style={CommonStyles.listSectionHeader}>{title}</Text>);
}

export const ItemSeparator = () => {
    return (<View style={CommonStyles.itemSeparator}/>)
}