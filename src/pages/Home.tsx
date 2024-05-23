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
  IonMenuButton,
  IonCard,
  IonCardContent, 
  
} from '@ionic/react';
import { arrowDown, arrowUp, cashOutline, exitOutline, personCircleOutline } from 'ionicons/icons';
import './Home.css';
import HeaderComponent from '../components/Header';
import Login from './Login';

const Home: React.FC = () => {
  return (
    <IonPage>
      {/* Menu Content */}
      <IonMenu contentId="main-content" side="end">
        <IonHeader className="ion-no-border">
          <IonToolbar color={'light'}>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" color={'light'}>
          <IonList >
            <IonItem button={true} href="/Login" color={'light'}>
              <IonIcon aria-hidden="true" slot="start" icon={exitOutline}></IonIcon>
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Header */}
      <IonHeader id="main-content" className="ion-no-border">
        <IonToolbar color={'bege'}>
          <IonButtons slot="end" className="ion-margin-right">
            <IonMenuButton>
              <IonIcon icon={personCircleOutline} size='large'></IonIcon>
            </IonMenuButton>
          </IonButtons>

          <IonText className='ion-margin-left'>
            <h4 className='ion-text-start ion-margin-start'>Seja Bem-vindo</h4>
            <h1 className='nome ion-text-start ion-margin-start'>Rodolfo Gama</h1>
          </IonText>
        </IonToolbar>
      </IonHeader>

      {/* Card */}
      <IonContent fullscreen color={'bege'}>
        <IonCard color={'verdeescuro'}>
          <IonCardContent>
            <IonGrid>
              <IonText className='ion-margin-left'>
                <h1 className='dashboard ion-text-start'>Dashboard</h1>
              </IonText>
              <IonRow>
                {/* Saldo */}
                <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='4' sizeXl='4'>
                  <IonButton color={'verdeclaro'} expand='block' fill='solid'>
                    <IonGrid>
                      <IonRow className='ion-align-items-center'>
                        <IonCol>
                          <IonText className='ion-text-start ion-text-uppercase'>
                            <p>Saldo</p>
                          </IonText>
                          <IonText className='ion-text-start'>
                            <h1>R$ 20,00</h1>
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
                  <IonButton color={'verdeclaro'} expand='block'>
                    <IonGrid>
                      <IonRow className='ion-align-items-center'>
                        <IonCol>
                          <IonText className='ion-text-start ion-text-uppercase'>
                            <p>Receitas</p>
                          </IonText>
                          <IonText className='ion-text-start'>
                            <h1>R$ 100,00</h1>
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
                  <IonButton color={'verdeclaro'} expand='block'>
                    <IonGrid>
                      <IonRow className='ion-align-items-center'>
                        <IonCol>
                          <IonText className='ion-text-start ion-text-uppercase'>
                            <p>Despesas</p>
                          </IonText>
                          <IonText className='ion-text-start'>
                            <h1>R$ 80,00</h1>
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
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
