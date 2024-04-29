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
  IonText
} from '@ionic/react';
import { arrowDown, arrowUp, cashOutline } from 'ionicons/icons';
import './Home.css';
import HeaderComponent from '../components/header/HeaderComponent';
import SaldoButtonComponent from '../components/buttons/Button';

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
              <SaldoButtonComponent></SaldoButtonComponent>
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
