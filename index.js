import { registerRootComponent } from 'expo';

import QueryScreen from './app/(tabs)/queries';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(QueryScreen);
