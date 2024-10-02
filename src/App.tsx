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
import Transferencias from './pages/Transferencias';
import Inicial from './pages/Inicial';
import Suporte from './pages/Support';

import './App.css';

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
import '@ionic/react/css/palettes/dark.css';
import './theme/variables.css';

import { ThemeProvider } from './components/ThemeContext';
import LandingPage from './pages/LandingPage';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <ThemeProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            <Redirect to="/inicial" />
          </Route>
          <Route path="/home" component={Home} />
          <Route path="/charts" component={Charts} />
          <Route path="/login" component={Login} />
          <Route path="/receitas" component={Receitas} />
          <Route path="/despesas" component={Despesas} />
          <Route path="/cadastro" component={Cadastro} />
          <Route path="/conta" component={Conta} />
          <Route path="/inicial" component={Inicial} />
          <Route path="/transferencias" component={Transferencias} />
          <Route path="/support" component={Suporte} />
          <Route path="/landingpage" component={LandingPage}></Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </ThemeProvider>
  </IonApp>
);

export default App;
