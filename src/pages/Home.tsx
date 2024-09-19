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
  IonCardContent,
  IonPopover,
  IonImg
} from '@ionic/react';
import { arrowDown, arrowUp, cashOutline, chevronDownOutline, personCircleOutline } from 'ionicons/icons';
import './Home.css';
import FooterTabBar from '../components/FooterTabBar';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getAggregateFromServer, getDoc, query, setDoc, sum, updateDoc, where } from 'firebase/firestore';
import Menu from '../components/Menu';
import { Chart } from "react-google-charts";
import SelectMonth from '../components/SelectMonth';

const Home: React.FC = () => {
  const [userInfo, setUserInfo] = useState(Object);
  const [receitaTotal, setReceitaTotal] = useState(Number);
  const [despesaTotal, setDespesaTotal] = useState(Number);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
  const [userImg, setUserImg] = useState(Object);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setUserInfo(user);

      if (!user) {
        window.location.href = '/login';
        return null;
      }

      if (user) {
        const uid = user.uid;
        const userPhoto = user.photoURL;
        setUserImg(userPhoto);

        // Receita
        const collReceitas = collection(db, 'UserFinance');
        const qReceitas = query(collReceitas, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "receita"));

        const snapshotReceitas = await getAggregateFromServer(qReceitas, {
          receitaTotal: sum('valor')
        });

        setReceitaTotal(snapshotReceitas.data().receitaTotal);

        // Despesa
        const collDespesas = collection(db, 'UserFinance');
        const qDespesas = query(collDespesas, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));

        const snapshotDespesas = await getAggregateFromServer(qDespesas, {
          despesaTotal: sum('valor')
        });

        setDespesaTotal(snapshotDespesas.data().despesaTotal);

        // Imprimir mês 
        const docRefMesSelecao = doc(db, "MesSelecao", uid);
        const docSnapMesSelecao = await getDoc(docRefMesSelecao);

        if (docSnapMesSelecao.exists()) {
          const selecaoMes = docSnapMesSelecao.data().mes;
          // console.log(selecaoMes);

          const mes = selecaoMes;

          setDataMesSelecionado(selecaoMes);
        }
      }
    });
  })

  
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
                <IonImg src={userImg.toString()} className='user-photo'></IonImg>
                {/* <IonIcon icon={personCircleOutline} size='large' /> */}
              </IonMenuButton>
            </IonButtons>
            <IonText>
              <h1 className='nome ion-text-start ion-margin-start'>{userInfo.displayName}</h1>
            </IonText>
          </IonToolbar>

          <SelectMonth cor='success'></SelectMonth>

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
                    <IonButton color={'light'} expand='block' href='Transferencias' className='card-button'>
                      <IonGrid>
                        <IonRow className='ion-align-items-center'>
                          <IonCol>
                            <IonText className='ion-text-start ion-text-uppercase'>
                              <p>Saldo</p>
                            </IonText>
                            <IonText className='ion-text-start'>
                              <h1>R$ {(receitaTotal - despesaTotal).toFixed(2)}</h1>
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
                              <h1>R$ {receitaTotal.toFixed(2)}</h1>
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
                              <h1>R$ {despesaTotal.toFixed(2)}</h1>
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
