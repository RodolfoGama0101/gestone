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
  IonPopover
} from '@ionic/react';
import { arrowDown, arrowUp, cashOutline, chevronDownOutline, personCircleOutline, time } from 'ionicons/icons';
import './Home.css';
import FooterTabBar from '../components/FooterTabBar';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getAggregateFromServer, getDoc, query, setDoc, sum, updateDoc, where } from 'firebase/firestore';
import Menu from '../components/Menu';

const Home: React.FC = () => {
  const [nome, setNome] = useState();
  const [user, setUser] = useState(Object);
  const [receitaTotal, setReceitaTotal] = useState(Number);
  const [despesaTotal, setDespesaTotal] = useState(Number);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [mesSelecionado, setMesSelecionado] = useState("");

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

    
  }, [])

  async function imprimirMes() {
    const uid = user.uid;

    const docRef = doc(db, "MesSelecao", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const selecaoMes = docSnap.data().mes;
      console.log(selecaoMes);

      const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
      ];
  
      const mes = selecaoMes;
  
      setMesSelecionado(meses[mes]);
    } else {
      console.error("Documento 'MesSelecao' não encontrado para o usuário:", uid);
    }
  }

  async function armazenarMesSelecionado() {
    const uid = user.uid;

    const docRef = doc(db, "MesSelecao", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        mes: selectedMonth
      });

      imprimirMes();

      console.log("armazenarMesSelecionado()");
    } else {
      await setDoc(docRef, {
        uid: uid,
        mes: selectedMonth
      });
    }
  }

  useEffect(() => {
    armazenarMesSelecionado();
  }, [selectedMonth])

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

          <IonGrid color='dark'>
            <IonRow class="ion-justify-content-center">
              <IonCol className="ion-text-center">
                <IonButton id='trigger-button' className='select-month-btn' color={'success'}>{mesSelecionado}<IonIcon icon={chevronDownOutline} className='icon-select-month'></IonIcon></IonButton>
                <IonPopover trigger='trigger-button' alignment='center' className='select-mes'>
                  <IonContent color={'success'} className='ion-text-center year-select'>
                    <IonText>2024</IonText>
                  </IonContent>
                  <IonButtons>
                    <IonGrid>
                      <IonRow>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(0) }}>Jan</IonButton></IonCol>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(1) }}>Fev</IonButton></IonCol>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(2) }}>Mar</IonButton></IonCol>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(3) }}>Abr</IonButton></IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(4) }}>Mai</IonButton></IonCol>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(5) }}>Jun</IonButton></IonCol>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(6) }}>Jul</IonButton></IonCol>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(7) }}>Ago</IonButton></IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(8) }}>Set</IonButton></IonCol>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(9) }}>Out</IonButton></IonCol>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(10) }}>Nov</IonButton></IonCol>
                        <IonCol><IonButton onClick={() => { setSelectedMonth(11) }}>Dez</IonButton></IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonButtons>
                </IonPopover>
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
