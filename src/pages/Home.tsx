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
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonTitle,
  IonItem,
  IonLabel
} from '@ionic/react';
import { alertCircleOutline, arrowDown, arrowUp, cashOutline, exitOutline, personCircleOutline, personOutline, document } from 'ionicons/icons';
import './Home.css';
import FooterTabBar from '../components/FooterTabBar';

import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Menu from '../components/Menu';

const Home: React.FC = () => {
  const [nome, setNome] = useState("Rodolfo Gama");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;

      const docRef = doc(db, "Users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const docData = docSnap.data();
        setNome(docData.firstName);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    } else {
      // User is signed out
      // ...
    }
  });

  return (
    <>
      <Menu></Menu>
      <IonPage id="main-content">
        
        {/* Header */}
        <IonHeader className="ion-no-border">

          <IonToolbar color={'dark'}>
            <IonText className='ion-margin-left'>
              <h4 className='ion-text-start ion-margin-start'>Seja Bem-vindo</h4>
              <h1 className='nome ion-text-start ion-margin-start'>{nome}</h1>
            </IonText>
            <IonButtons slot="end" className="ion-margin-right">
              <IonMenuButton>
                <IonIcon icon={personCircleOutline} size='large' />
              </IonMenuButton>
            </IonButtons>
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
    </>
  );
};

export default Home;
