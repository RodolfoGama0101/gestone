import React, { useEffect, useState } from 'react';
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
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { arrowDown, arrowUp, cashOutline, exitOutline, personCircleOutline } from 'ionicons/icons';
import './Home.css';
import FooterTabBar from '../components/FooterTabBar';

import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Menu from '../components/Menu';

const Home: React.FC = () => {
  const [nome, setNome] = useState("");
  const [user, setUser] = useState(Object);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const uid = user.uid;
        const docRef = doc(db, "Users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const docData = docSnap.data();
          setNome(docData.firstName);
        } else {
          console.log("No such document!");
        }
      }
    });
  }, []);

  if (!user) {
    window.location.href = '/login'; 
    return null; 
  }

  return (
    <>
      <Menu />

      <IonPage id="main-content">

        {/* Header */}
        <IonHeader className="ion-no-border">

          <IonToolbar color={'dark'}>
            <IonGrid>
              <IonRow>
                <IonCol>
                  {/* User name */}
                  <IonText className='ion-margin-left'>
                    <h4 className='ion-text-start ion-margin-start'>Seja Bem-vindo</h4>
                    <h1 className='nome ion-text-start ion-margin-start'>{nome}</h1>
                  </IonText>
                </IonCol>
                <IonCol>
                  {/* Select month */}
                  <IonSelect aria-label="Meses" interface="popover" placeholder="Selecione um mês" fill="outline" >
                    <IonSelectOption>Janeiro</IonSelectOption>
                    <IonSelectOption>Fevereiro</IonSelectOption>
                    <IonSelectOption>Março</IonSelectOption>
                    <IonSelectOption>Abril</IonSelectOption>
                    <IonSelectOption>Maio</IonSelectOption>
                    <IonSelectOption>Junho</IonSelectOption>
                    <IonSelectOption>Julho</IonSelectOption>
                    <IonSelectOption>Agosto</IonSelectOption>
                    <IonSelectOption>Setembro</IonSelectOption>
                    <IonSelectOption>Outubro</IonSelectOption>
                    <IonSelectOption>Novembro</IonSelectOption>
                    <IonSelectOption>Dezembro</IonSelectOption>
                  </IonSelect>
                </IonCol>
                <IonCol>
                  {/* Menu button */}
                  <IonButtons className="ion-margin-right">
                    <IonMenuButton>
                      <IonIcon icon={personCircleOutline} size='large' />
                    </IonMenuButton>
                  </IonButtons>
                </IonCol>
              </IonRow>
            </IonGrid>
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
