import { Suspense, useState, lazy } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NavigationProp, RootStackParamList } from './navigationTypes';
import ScreenWrapper from './ScreenWrapper';

import Loading from '../components/UI/Loading';
import { Screens } from '../config/app';
import { RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const DashboardScreen = lazy(() => import('../screen/Dashboard/Dashboard.screen'));
const SettingsScreen = lazy(() => import('../screen/Dashboard/settings.screen'));
const FleetScreen = lazy(() => import('../screen/Dashboard/fleet.sceen'));
const RouteScreen = lazy(() => import('../screen/Dashboard/Route.screen'));
const ServiceCallScreen = lazy(() => import('../screen/ServiceCall/ServiceCall.screen'));

const StoreScreen = lazy(() => import('../screen/Stores/Store.screen'));
const LocationScreen = lazy(() => import('../screen/Locations/Location.screen'));
const Survey = lazy(() => import('../screen/Survey/Survey.screen'));
const PdfReader = lazy(() => import('../screen/Invoice/PdfReader.screen'));
const PaymentOption = lazy(() => import('../screen/Invoice/PaymentOption.screen'));
const StoreInvoicesScreen = lazy(() => import('../screen/Invoice/StoreInvoices.screen'));
const InvoiceGenerate = lazy(() => import('../screen/Invoice/InvoiceGenerate.screen'));
const ImageViewScreen = lazy(() => import('../screen/ImageView/ImageView.screen'));
const SubItemsScreen = lazy(() => import('../screen/Invoice/SubItems.screen'));
const LicenseScreen = lazy(() => import('../screen/License/License.screen'));
const AtgiScreen = lazy(() => import('../screen/ATG_Inventory/Atgi.screen'));
const AtgsScreen = lazy(() => import('../screen/ATG_Sensor/Atgs.screen'));
const SiteInfoScreen = lazy(() => import('../screen/SiteInfo/SiteInfo.screen'));
const NotesScreen = lazy(() => import('../screen/Rotes/Notes/Note.screen'));

const ServiceCallViewScreen = lazy(() => import('../screen/ServiceCall/ServiceCall_View.screen'));
const ServiceCallHistoryScreen = lazy(() => import('../screen/ServiceCall/ServiceCall_History.screen'));
const MaintainsLogsScreen = lazy(() => import('../screen/Rotes/Maintain_logs/MaintainsLogs.screen'));

interface BaseListenerProps {
  navigation: NavigationProp;
  route: RouteProp<RootStackParamList>;
}

type CustomListenerProps = BaseListenerProps & {
  tabName: ScreenName;
};

export const HeaderName: any = {
  License: 'License',
  Pictures: 'Pictures',
  Invoice: 'Invoice',
  RouteInvoice: 'Route Invoice',
  RouteInvoices: 'Previous Invoices',
  Locations: 'Locations',
  Stores: 'Stores',
  ATG_Inventory: 'ATG Inventory',
  ATG_Sensor: 'ATG Sensor',
  Mounthly_Inspection_Report: 'Monthly inspection',
  Site_Info: 'Site Info',
  ServiceCall_View: 'Service Call',
  ServiceCall_History: 'Service History',
  Notes: 'Notes',
  MaintainsLogs: 'Maintains Logs'
};

type ScreenName = keyof Screens;
const Stack = createStackNavigator<RootStackParamList>();


const HomeStackNavigator = () => {
  const [selectedTab, setSelectedTab] = useState<ScreenName>("Dashboard");

  const renderScreen = (Component: React.FC<any>, ScreenName?: ScreenName) => (props: any) => (
    <ScreenWrapper selectedTab={selectedTab} setSelectedTab={setSelectedTab} ScreenName={ScreenName || selectedTab}>
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    </ScreenWrapper>
  );

  const createCustomListeners = ({ navigation, route, tabName }: CustomListenerProps) => ({
    focus: () => {
      setSelectedTab(tabName)
    },
    // blur: () => { console.log('Screen is blurred', route.name) },
    // beforeRemove: (e: any) => { if () {e.preventDefault()}},
  });
  // (solving sore to invoice scrn issue) const { location: { cus_name } } = useSelector((state: RootState) => state.routeReducer);

  const getListeners = (tabName: ScreenName) => ({ navigation, route }: BaseListenerProps) =>
    createCustomListeners({ navigation, route, tabName });

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Dashboard">
      <Stack.Screen name="Dashboard" component={renderScreen(DashboardScreen)} listeners={getListeners("Dashboard")} />
      <Stack.Screen name="Route" component={renderScreen(RouteScreen)} listeners={getListeners("Route")} />
      <Stack.Screen name="ServiceCall" component={renderScreen(ServiceCallScreen)} listeners={getListeners("ServiceCall")} />
      <Stack.Screen name="Fleet" component={renderScreen(FleetScreen)} listeners={getListeners("fleet")} />
      <Stack.Screen name="Settings" component={renderScreen(SettingsScreen)} listeners={getListeners("Settings")} />

      <Stack.Screen name="Survey" component={renderScreen(Survey, HeaderName.Mounthly_Inspection_Report)} listeners={getListeners("Route")} />
      <Stack.Screen name="InvoiceGenerate" component={renderScreen(InvoiceGenerate, HeaderName.Invoice)} listeners={getListeners("Route")} />
      <Stack.Screen name="PaymentOption" component={renderScreen(PaymentOption)} listeners={getListeners("Route")} />
      <Stack.Screen name="PdfReader" component={renderScreen(PdfReader, HeaderName.Stores)} listeners={getListeners("Route")} />
      <Stack.Screen name="LocationList" component={renderScreen(LocationScreen, HeaderName.Locations)} listeners={getListeners("Route")} />
      <Stack.Screen name="StoreList" component={renderScreen(StoreScreen, HeaderName.Stores)} listeners={getListeners("Route")} />
      <Stack.Screen name="ImageView" component={renderScreen(ImageViewScreen, HeaderName.Pictures)} listeners={getListeners("Route")} />
      <Stack.Screen name="InvoiceSubItems" component={renderScreen(SubItemsScreen, HeaderName.RouteInvoice)} listeners={getListeners("Route")} />
      <Stack.Screen name="StoreInvoices" component={renderScreen(StoreInvoicesScreen, HeaderName.RouteInvoices)} listeners={getListeners("Route")} />
      <Stack.Screen name="StoreLicense" component={renderScreen(LicenseScreen, HeaderName.License)} listeners={getListeners("Route")} />
      <Stack.Screen name="ATG_I" component={renderScreen(AtgiScreen, HeaderName.ATG_Inventory)} listeners={getListeners("Route")} />
      <Stack.Screen name="ATG_S" component={renderScreen(AtgsScreen, HeaderName.ATG_Sensor)} listeners={getListeners("Route")} />
      <Stack.Screen name="SiteInfo" component={renderScreen(SiteInfoScreen, HeaderName.Site_Info)} listeners={getListeners("Route")} />
      <Stack.Screen name="Notes" component={renderScreen(NotesScreen, HeaderName.Notes)} listeners={getListeners("Route")} />
      <Stack.Screen name="MaintainsLogs" component={renderScreen(MaintainsLogsScreen, HeaderName.MaintainsLogs)} listeners={getListeners("Route")} />

      <Stack.Screen name="ServiceCallView" component={renderScreen(ServiceCallViewScreen, HeaderName.ServiceCall_View)} listeners={getListeners("ServiceCall")} />
      <Stack.Screen name="ServiceCall_Histroy" component={renderScreen(ServiceCallHistoryScreen, HeaderName.ServiceCall_History)} listeners={getListeners("ServiceCall")} />
    </Stack.Navigator>
  );
};


export default HomeStackNavigator;




// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useNavigation, DrawerActions } from '@react-navigation/native';
// import { Image, TouchableOpacity } from 'react-native';
// import { createDrawerNavigator } from '@react-navigation/drawer';


// import Home from '../screen/home.screen';
// import FleetScreen from '../screen/fleet.sceen';
// import assetsPng from '../assets/pngs';
// import DrawerContent from './drawerContent';


// const { IconMenu } = assetsPng;


// const StackNav = () => {
//   const Stack = createNativeStackNavigator();
//   const navigation = useNavigation()
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: '#0163d2',
//         },
//         headerTintColor: '#fff',
//         headerTitleAlign: 'center',


//       }}
//     >
//       <Stack.Screen name="Home" component={Home} options={{
//         headerLeft: () => {
//           return (
//             <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
//               <Image
//                 source={IconMenu}
//                 resizeMode='contain'
//                 style={{
//                   width: 20, height: 20,
//                 }}
//               />
//             </TouchableOpacity>
//           )
//         }
//       }} />
//       <Stack.Screen name="FleetStatus" component={FleetScreen} />
//       <Stack.Screen name="ManageFleet" component={FleetScreen} />
//     </Stack.Navigator>
//   )
// }


// const DrawerNav = () => {
//   const Drawer = createDrawerNavigator()
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//       drawerContent={props => <DrawerContent {...props} />}
//     >
//       <Drawer.Screen name="Home-Page" component={StackNav} />
//     </Drawer.Navigator>
//   )
// }
// const HomeStackNavigator = () => {


//   return (
//     <DrawerNav />
//   );
// };


// export default HomeStackNavigator;
