import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Charts from './pages/Charts';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Despesas from './pages/Despesas';
import Conta from './pages/Conta';
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
import '@ionic/react/css/palettes/dark.class.css';
import './theme/variables.css';
import Transferencias from './pages/Transferencias';
import Inicial from './pages/Inicial';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
      <Route exact path="/">
          <Redirect to="/inicial" />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/charts">
          <Charts />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/receitas">
          <Receitas />
        </Route>
        <Route path="/despesas">
          <Despesas />
        </Route>
        <Route path="/cadastro">
          <Cadastro />
        </Route>
        <Route path="/conta">
          <Conta />
        </Route>
        <Route path="/inicial">
          <Inicial />
        </Route>
        <Route path="/transferencias">
          <Transferencias />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>

);

export default App;
