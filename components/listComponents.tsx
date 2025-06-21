import { Text, View } from "react-native";
import CommonStyles from "../constants/commonStyle";

export function ListEmpty({text}: {text?: string}) {
    return (<Text style={CommonStyles.listEmptyText}>{text || 'No items match your query'}</Text>)
}

export function SectionHeader({section: {title}}: {section: {title: string}}) {
    return (<Text style={CommonStyles.listSectionHeader}>{title}</Text>);
}

export function ItemSeparator() {
    return (<View style={CommonStyles.itemSeparator}/>)
}