import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IonReactRouter } from '@ionic/react-router';
import { IonFab, IonFabButton, IonIcon, IonImg, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Redirect, Route } from 'react-router';
import Home from './pages/Home';
import Add from './pages/Add';
import Charts from './pages/Charts';
import { barChartOutline, homeOutline } from 'ionicons/icons';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function Example() {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/home" />
          {/*
          Use the render method to reduce the number of renders your component will have due to a route change.

          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
          <Route path="/home" render={() => <Home />} exact={true} />
          <Route path="/add" render={() => <Add />} exact={true} />
          <Route path="/charts" render={() => <Charts />} exact={true} />
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
  );
}
export default Example;