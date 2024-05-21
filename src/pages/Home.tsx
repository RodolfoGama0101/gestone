import {
  IonContent,
  IonHeader,
  IonPage,
  IonButtons,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonMenu,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonMenuButton
} from '@ionic/react';
import { arrowDown, arrowUp, cashOutline, exitOutline, personCircleOutline } from 'ionicons/icons';
import './Home.css';
import HeaderComponent from '../components/Header';
import Login from './Login';

const Home: React.FC = () => {
  return (
    <IonPage>

      <IonMenu contentId="main-content" side="end">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem button={true} href="/Login">
              <IonIcon aria-hidden="true" slot="start" icon={exitOutline}></IonIcon>
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonHeader id="main-content" className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="end" className="ion-margin-right">
            <IonMenuButton>
              <IonIcon icon={personCircleOutline}></IonIcon>
            </IonMenuButton>
          </IonButtons>

          <IonText className='ion-margin-left'>
            <h1 className='ion-text-start ion-margin-start'>Olá Rodolfo!</h1>
          </IonText>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>

          <IonText className='ion-margin-left'>
            <h1 className='ion-text-start ion-margin-start'>Dashboard</h1>
          </IonText>
          <IonRow>
            {/* Saldo */}
            <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='4' sizeXl='4'>
              <IonButton color={'light'} expand='block' fill='solid'>
                <IonGrid>
                  <IonRow className='ion-align-items-center'>
                    <IonCol>
                      <IonText className='ion-text-start ion-text-uppercase'>
                        <p>Saldo</p>
                      </IonText>
                      <IonText className='ion-text-start'>
                        <h1>R$ 0,00</h1>
                      </IonText>
                    </IonCol>
                    <IonCol>
                      <IonIcon icon={cashOutline} className='ion-float-right ion-padding ion-border home-buttons-icons'></IonIcon>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonButton>
            </IonCol>

            {/* Receitas */}
            <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='4' sizeXl='4'>
              <IonButton color={'light'} expand='block'>
                <IonGrid>
                  <IonRow className='ion-align-items-center'>
                    <IonCol>
                      <IonText className='ion-text-start ion-text-uppercase'>
                        <p>Receitas</p>
                      </IonText>
                      <IonText className='ion-text-start'>
                        <h1>R$ 0,00</h1>
                      </IonText>
                    </IonCol>
                    <IonCol>
                      <IonIcon icon={arrowUp} className='ion-float-right ion-padding ion-border home-buttons-icons'></IonIcon>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonButton>
            </IonCol>

            {/* Despesas */}
            <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='4' sizeXl='4'>
              <IonButton color={'light'} expand='block'>
                <IonGrid>
                  <IonRow className='ion-align-items-center'>
                    <IonCol>
                      <IonText className='ion-text-start ion-text-uppercase'>
                        <p>Despesas</p>
                      </IonText>
                      <IonText className='ion-text-start'>
                        <h1>R$ 0,00</h1>
                      </IonText>
                    </IonCol>
                    <IonCol>
                      <IonIcon icon={arrowDown} className='ion-float-right ion-padding ion-border home-buttons-icons'></IonIcon>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonButton>
            </IonCol>

          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
