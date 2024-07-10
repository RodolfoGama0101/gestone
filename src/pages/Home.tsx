import React, { useState } from 'react';

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
  IonFooter,
  IonFab,
  IonFabButton,
  IonImg,

} from '@ionic/react';
import { arrowDown, arrowUp, cashOutline, exitOutline, personCircleOutline, document, personOutline, alertCircleOutline, homeOutline, barChartOutline } from 'ionicons/icons';
import './Home.css';
import { getAuth, signOut } from "firebase/auth";
import FooterTabBar from '../components/FooterTabBar';

const Home: React.FC = () => {
  const [nome, setNome] = useState("Rodolfo Gama");

  function logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      window.location.href = "/";
    }).catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
  }

  return (
    <IonPage>
      {/* Menu Content */}
      <IonMenu contentId="main-content" side="end">
        <IonHeader className="ion-no-border">
          <IonToolbar color={'medium'}>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" color={'dark'}>

          <IonItem button={true} href="/Login" color={'dark'}>
            <IonIcon aria-hidden="true" slot="start" icon={document}></IonIcon>
            <IonLabel>Dados Pessoais</IonLabel>
          </IonItem>

          <IonItem button={true} href="/Login" color={'dark'}>
            <IonIcon aria-hidden="true" slot="start" icon={personOutline}></IonIcon>
            <IonLabel>Sua Conta</IonLabel>
          </IonItem>

          <IonItem button={true} href="/Login" color={'dark'}>
            <IonIcon aria-hidden="true" slot="start" icon={alertCircleOutline}></IonIcon>
            <IonLabel>Support</IonLabel>
          </IonItem>

          <IonItem button={true} href="/Login" color={'dark'} onClick={logout}>
            <IonIcon aria-hidden="true" slot="start" icon={exitOutline}></IonIcon>
            <IonLabel>Logout</IonLabel>
          </IonItem>

        </IonContent>
      </IonMenu>

      {/* Header */}
      <IonHeader id="main-content" className="ion-no-border">
        <IonToolbar color={'dark'}>
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
      <IonContent fullscreen color={'dark'}>
        <IonCard color={'medium'} className='card-1'>
          <IonCardContent>
            <IonGrid>
              <IonText className='ion-margin-left'>
                <h1 className='dashboard ion-text-start'>Dashboard</h1>
              </IonText>
              <IonRow>
                {/* Saldo */}
                <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='4' sizeXl='4'>
                  <IonButton color={'light'} expand='block' href='Saldo' className='card-button'>
                    <IonGrid>
                      <IonRow className='ion-align-items-center'>
                        <IonCol>
                          <IonText className='ion-text-start ion-text-uppercase'>
                            <p>Saldo</p>
                          </IonText>
                          <IonText className='ion-text-start'>
                            <h1>R$ 0</h1>
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
                  <IonButton color={'light'} expand='block' href='receitas' className='card-button'>
                    <IonGrid>
                      <IonRow className='ion-align-items-center'>
                        <IonCol>
                          <IonText className='ion-text-start ion-text-uppercase'>
                            <p>Receitas</p>
                          </IonText>
                          <IonText className='ion-text-start'>
                            <h1>R$ 0</h1>
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
                  <IonButton color={'light'} expand='block' href='despesas' className='card-button'>
                    <IonGrid>
                      <IonRow className='ion-align-items-center'>
                        <IonCol>
                          <IonText className='ion-text-start ion-text-uppercase'>
                            <p>Despesas</p>
                          </IonText>
                          <IonText className='ion-text-start'>
                            <h1>R$ 0</h1>
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
      
      <FooterTabBar></FooterTabBar>
    </IonPage>
  );
};

export default Home;
