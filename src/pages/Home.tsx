import React, { useEffect, useState } from 'react';
import {
  IonContent,
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
  IonCardContent
} from '@ionic/react';
import { arrowDown, arrowUp, cashOutline, exitOutline, personCircleOutline } from 'ionicons/icons';
import './Home.css';
import FooterTabBar from '../components/FooterTabBar';

import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getAggregateFromServer, getDoc, query, sum, where } from 'firebase/firestore';
import Menu from '../components/Menu';
import SelectMonthYear from '../components/SelectMonthYear';

const Home: React.FC = () => {
  const [nome, setNome] = useState("");
  const [user, setUser] = useState(Object);
  const [receitaTotal, setReceitaTotal] = useState(Number);
  const [despesaTotal, setDespesaTotal] = useState(Number);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  if (!user) {
    window.location.href = '/login';
    return null;
  }

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

        // Receita
        const collReceitas = collection(db, 'Receitas');
        const qReceitas = query(collReceitas, where("uid", "==", uid));

        const snapshotReceitas = await getAggregateFromServer(qReceitas, {
          receitaTotal: sum('valorReceita')
        });

        setReceitaTotal(snapshotReceitas.data().receitaTotal);

        // Despesa
        const collDespesas = collection(db, 'Despesas');
        const qDespesas = query(collDespesas, where("uid", "==", uid));
        // const qDespesasEMes = query(qDespesas, where("data", "==", selectedMonth));

        const snapshotDespesas = await getAggregateFromServer(qDespesas, {
          despesaTotal: sum('valorDespesa')
        });

        setDespesaTotal(snapshotDespesas.data().despesaTotal);
      }
    });
  }, []);

  // useEffect(() => {
  //   const collectionRef = collection(db, 'Receitas');
  //   const q = query(collectionRef, where('month', '==', selectedMonth));

  //   query.get().then((querySnapshot) => {
  //     const receitas = [];
  //     querySnapshot.forEach((doc) => {
  //       receitas.push(doc.data());
  //     });

  //     // Update UI with receitas data
  //   });
  // }, [selectedMonth]);

  // const handleMonthChange = (event) => {
  //   setSelectedMonth(parseInt(event.target.value));
  // };

  // useEffect(() => {
  //   const storedMonth = localStorage.getItem('selectedMonth');
  //   if (storedMonth !== null) {
  //     setSelectedMonth(parseInt(storedMonth));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('selectedMonth', selectedMonth);
  // }, [selectedMonth]);

  return (
    <>
      <Menu />

      <IonPage id="main-content">
        <IonContent fullscreen color={'dark'}>
          {/* Header */}
          <IonToolbar color={'dark'}>
            {/* User name */}
            <IonText className='ion-margin-left'>
              <h4 className='ion-text-start ion-margin-start'>Seja Bem-vindo</h4>
            </IonText>
            {/* Menu button */}
            <IonButtons slot='end'>
              <IonMenuButton>
                <IonIcon icon={personCircleOutline} size='large' />
              </IonMenuButton>
            </IonButtons>
            <IonText>
              <h1 className='nome ion-text-start ion-margin-start'>{nome}</h1>
            </IonText>
          </IonToolbar>

          <IonGrid >
            <IonRow class="ion-justify-content-center">
              <IonCol sizeXl='3'>
                <SelectMonthYear></SelectMonthYear>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Card */}
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
                              <h1>R$ {receitaTotal - despesaTotal}</h1>
                            </IonText>
                          </IonCol>
                          <IonCol>
                            <IonIcon icon={cashOutline} className='ion-float-right ion-padding ion-border home-buttons-icons saldo-button'></IonIcon>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonButton>
                  </IonCol>

                  {/* Despesas */}
                  <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='4' sizeXl='4'>
                    <IonButton color={"success"} expand='block' href='receitas' className='card-button'>
                      <IonGrid>
                        <IonRow className='ion-align-items-center'>
                          <IonCol>
                            <IonText className='ion-text-start ion-text-uppercase'>
                              <p>Receitas</p>
                            </IonText>
                            <IonText className='ion-text-start'>
                              <h1>R$ {receitaTotal}</h1>
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
                    <IonButton color={'danger'} expand='block' href='despesas' className='card-button'>
                      <IonGrid>
                        <IonRow className='ion-align-items-center'>
                          <IonCol>
                            <IonText className='ion-text-start ion-text-uppercase'>
                              <p>Despesas</p>
                            </IonText>
                            <IonText className='ion-text-start'>
                              <h1>R$ {despesaTotal}</h1>
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
