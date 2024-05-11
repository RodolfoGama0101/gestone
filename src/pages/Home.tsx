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
  IonToolbar, 
  IonImg, 
  IonTitle
} from '@ionic/react';
import { arrowDown, arrowUp, cashOutline, personCircleOutline } from 'ionicons/icons';
import './Home.css';
import Login from './Login';


const HeaderComponent: React.FC = () => {
  return (
      <IonHeader>
          <IonToolbar>
              <IonButtons slot='start'>
                  <IonButton href='#'>
                      <IonImg src='/icone.svg'></IonImg>
                  </IonButton>
              </IonButtons>

              <IonButtons slot='end' className='login-button'>
                  <IonButton routerLink='Login'>
                      <IonIcon icon={personCircleOutline}></IonIcon>
                  </IonButton>
              </IonButtons>

              <IonTitle>GESTONE</IonTitle>
          </IonToolbar>
      </IonHeader>
  )
}

const Home: React.FC = () => {
  return (
    <IonPage>

      <HeaderComponent></HeaderComponent>

      <IonContent fullscreen>
        <IonText>
          <h1 className='ion-text-start ion-margin-start'>Dashboard</h1>
        </IonText>

        <IonGrid>
          <IonRow>
            {/* Saldo */}
            <IonCol>
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
            <IonCol>
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
            <IonCol>
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
