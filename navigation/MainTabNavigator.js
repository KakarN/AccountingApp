import {createMaterialTopTabNavigator} from 'react-navigation'
import Colors from '../constants/Colors'
import BudgetListScreen from "../screens/BudgetListScreen";
import NoteList from "../screens/NoteList";

const MainTabNavigator = createMaterialTopTabNavigator({
    ExpenditurePlanning: {
        screen: BudgetListScreen,
        navigationOptions: {
            title: 'Expenses'
        },
        params: {
            storeType: 'expenditure'
        }
    },
    NoteScreen: {
        screen: NoteList,
        navigationOptions: {
            title: 'Notes'
        },
    },
    EstimateBudget: {
        screen: BudgetListScreen,
        navigationOptions: {
            title: 'Estimate'
        },
        params: {
            storeType: 'estimation'
        }
    },
}, {
    tabBarOptions: {
        labelStyle: {
            fontSize: 12,
        },
        indicatorStyle: {
            backgroundColor: Colors.secondaryColor
        },
        style: {
            backgroundColor: Colors.primaryColor,
        },
        inactiveTintColor: Colors.primaryColorHighlight
    }
})

export default MainTabNavigator