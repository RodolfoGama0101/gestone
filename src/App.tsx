import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonFab,
  IonFabButton, 
  IonImg
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, barChartOutline, add } from 'ionicons/icons';
import Home from './pages/Home';
import Add from './pages/Add';
import Charts from './pages/Charts';
import Login from './pages/Login';
import Saldo from './pages/Saldo';
import Despesas from './pages/Despesas';
import Receitas from './pages/Receitas';
import './App.css'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { } from 'firebase/firestore'; // Firestore
import { } from 'firebase/auth'; // Authentication

const firebaseConfig = {
  apiKey: "AIzaSyA9jwO8zMER2O5-CHiW1lGtzaYTM_5QqXg",
  authDomain: "gestone-d508a.firebaseapp.com",
  projectId: "gestone-d508a",
  storageBucket: "gestone-d508a.appspot.com",
  messagingSenderId: "382008916816",
  appId: "1:382008916816:web:19f74b882d17a6d6fc8a55",
  measurementId: "G-Y4RN9ZK20K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route path="/add">
            <Add />
          </Route>
          <Route path="/charts">
            <Charts />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/saldo">
            <Saldo />
          </Route>
          <Route path="/receitas">
            <Receitas />
          </Route>
          <Route path="/despesas">
            <Despesas />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom" color={'dark'}>
          <IonTabButton tab="Home" href="/Home">
            <IonIcon aria-hidden="true" icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>

          <IonTabButton tab="Add" href="/Add">
            <IonFab>
              <IonFabButton color={'dark'}>
                <IonImg src='/addIcon.svg' />
              </IonFabButton>
            </IonFab>
          </IonTabButton>

          <IonTabButton tab="Charts" href="/Charts">
            <IonIcon aria-hidden="true" icon={barChartOutline} />
            <IonLabel>Grafics</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
