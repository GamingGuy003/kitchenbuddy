import { StyleSheet } from "react-native";

// styles reused across different parts of the application
const CommonStyles = StyleSheet.create({
    // container to fit in all page content
    pageContainer: {
        padding: 20
    },
    // label for input
    label: {
        fontSize: 16,
        marginTop: 20,
        fontWeight: '500'
    },
    // text input field
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    // separates the items in a list
    itemSeparator: {
        height: 10
    },
    // vertically aligned components
    rowView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignContent: 'flex-end',
        flex: 1,
        gap: 10,
    },
    // red buttons
    redButton: {
        color: 'red'
    },
    // title for ingredient card
    ingredientContainerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    list: {
        paddingVertical: 10
    },
    // text displayed when list has no content
    listEmptyText: {
        textAlign: 'center',
    },
    // text displayed at the beginning of sections
    listSectionHeader: {
        fontWeight: 'bold',
        fontSize: 24,
        paddingBottom: 5
    },
});

export default CommonStyles;