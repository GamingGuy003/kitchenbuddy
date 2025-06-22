import { StyleSheet } from "react-native";

// styles reused across different parts of the application
const CommonStyles = StyleSheet.create({
    // renders a card with the content
    item: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5
    },
    // text for badges like open frozen or ripeness check
    badgeText: {
        textAlign: 'center',
        fontWeight: '500'
    },
    // separates a view from above with a line and space
    bottomButtons: {
        paddingTop: 20,
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#ddd'
    },
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
        paddingTop: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        fontSize: 16,
        borderColor: '#ccc',
    },
    // disabled text input field
    inputInactive: {
        paddingTop: 15,
        paddingBottom: 5,
        fontSize: 16,
        color: '#777'
    },
    // separates the items in a list
    itemSeparator: {
        height: 10
    },
    // vertically aligned components
    rowView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        gap: 10,
    },
    // add to all buttons in  a row to make them wide and spaced equally
    rowButton: {
        flex: 1,
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