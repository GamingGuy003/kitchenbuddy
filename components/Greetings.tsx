import { Text, View } from "react-native"

const Greet = ({name}:{name:string}) => {
  return (
    <Text>
      Hello {name}
    </Text>
  )
}

export const GreetAll = ({names}:{names:string[]}) => {
  return (
    <View>
      { names.map(name => <Greet name={name}/>) }
    </View>
  )
}