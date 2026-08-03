import { registerRootComponent } from 'expo';
import notifee, { EventType } from '@notifee/react-native';

import App from './App';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
    const data = detail?.notification?.data || {};
    if (data.type === 'medication-reminder' || data.type === 'test-alarm') {
      return;
    }
  }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
