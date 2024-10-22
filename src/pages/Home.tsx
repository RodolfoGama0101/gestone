import React, { useContext, useEffect, useState } from 'react';
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
import { arrowDown, arrowUp, cashOutline, menuOutline,chevronDownOutline, moonOutline, sunnyOutline, arrowForwardCircleOutline } from 'ionicons/icons';
import './css/Home.css';
import FooterTabBar from '../components/FooterTabBar';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getAggregateFromServer, getDoc, getDocs, query, setDoc, sum, updateDoc, where } from 'firebase/firestore';
import Menu from '../components/Menu';
import { meses } from '../variables/variables';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { ThemeContext } from '../components/ThemeContext';

// Registrando os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Home: React.FC = () => {
  interface DespesasData {
    valor: number;
    tag: string;
  }

  const [userInfo, setUserInfo] = useState(Object);
  const [receitaTotal, setReceitaTotal] = useState(Number);
  const [despesaTotal, setDespesaTotal] = useState(Number);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
  const [userImg, setUserImg] = useState(Object);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [tags, setTags] = useState(Object);
  const [tagsData, setTagsData] = useState<DespesasData[]>([]);
  const [tagsDataAgrupado, setTagsDataAgrupado] = useState<DespesasData[]>([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setUserInfo(user);

      // Verifica login
      if (!user) {
        window.location.href = '/login';
        return null;
      }

      if (user) {
        // Identificador de usuário
        const uid = user.uid;
        // Foto de perfil
        const userPhoto = user.photoURL;
        setUserImg(userPhoto);

        // Soma de receitas
        const collReceitas = collection(db, 'UserFinance');
        const qReceitas = query(collReceitas, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "receita"));

        const snapshotReceitas = await getAggregateFromServer(qReceitas, {
          receitaTotal: sum('valor')
        });

        setReceitaTotal(snapshotReceitas.data().receitaTotal);

        // Query despesas
        const collDespesas = collection(db, 'UserFinance');
        const qDespesas = query(collDespesas, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));

        // Soma despesas
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

          setDataMesSelecionado(selecaoMes);
        }
      }
    });
  })

  // Selecionar mês 
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setUserInfo(user);
      if (user) {
        const uid = user.uid;

        // Imprimir mês 
        const docRefMesSelecao = doc(db, "MesSelecao", uid);
        const docSnapMesSelecao = await getDoc(docRefMesSelecao);

        if (docSnapMesSelecao.exists()) {
          const selecaoMes = docSnapMesSelecao.data().mes;
          // console.log(selecaoMes);

          const mes = selecaoMes;

          setDataMesSelecionado(selecaoMes);
          setMesSelecionado(meses[mes]);
        }
      }
    })
  })

  async function imprimirMes() {
    const uid = userInfo.uid;

    const docRef = doc(db, "MesSelecao", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const selecaoMes = docSnap.data().mes;
      // console.log(selecaoMes);

      const mes = new Date(selecaoMes);
      setDataMesSelecionado(mes.getMonth());

      setMesSelecionado(meses[selecaoMes]);
    } else {
      console.error("Documento 'MesSelecao' não encontrado para o usuário:", uid);
    }
  }

  async function armazenarMesSelecionado() {
    const refDoc = doc(db, "MesSelecao", userInfo.uid);
    const snapDoc = await getDoc(refDoc);

    if (snapDoc.exists()) {
      await updateDoc(refDoc, {
        mes: selectedMonth
      });

      imprimirMes();

      // console.log("armazenarMesSelecionado()");
    } else {
      await setDoc(refDoc, {
        uid: userInfo.uid,
        mes: selectedMonth
      });

      imprimirMes();
    }
  }

  useEffect(() => {
    armazenarMesSelecionado();
  }, [selectedMonth])

  // Bar Chart
  const dataBar = {
    labels: ['Receitas', 'Despesas'],
    datasets: [{
      data: [receitaTotal, despesaTotal],
      backgroundColor: [
        'rgba(46, 161, 77, 0.6)',
        'rgba(197, 0, 15, 0.6)',
      ],
      borderColor: [
        'rgba(46, 161, 77, 1)',
        'rgba(197, 0, 15, 1)',
      ],
      borderWidth: 1
    }]
  };

  const optionsBar = {
    maintainAspectRatio: false,
    aspectRatio: 2, // Proporção largura/altura
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#FFFFFF', // Cor branca para os valores do eixo Y
        },
        grid: {
          color: '#555555', // Opcional: cor da linha do grid
        }
      },
      x: {
        ticks: {
          color: '#FFFFFF', // Cor branca para os valores do eixo X
        },
        grid: {
          color: '#555555', // Opcional: cor da linha do grid
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  // Tag query
  async function buscarTags() {
    const docRef = doc(db, "TagsDespesas", userInfo.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let tagData = docSnap.data();
      setTags(tagData.tags);
    } else {
      console.log("No such document!");
    }
  }

  async function getTagsDespesas() {
    const collDespesas = collection(db, 'UserFinance');
    const qDespesas = query(collDespesas,
      where("uid", "==", userInfo.uid),
      where("mes", "==", dataMesSelecionado),
      where("tipo", "==", "despesa"));

    try {
      const querySnapshot = await getDocs(qDespesas);

      const despesasData = querySnapshot.docs.map((doc) => {
        return {
          valor: doc.data().valor,
          tag: doc.data().tag,
        };
      });

      setTagsData(despesasData); // Ajustado para usar despesasData
      console.log(despesasData); // Corrigido para logar despesasData

      // Após buscar as despesas, agrupar por tag
      const despesasAgrupadas = agruparDespesasPorTag(despesasData);
      setTagsDataAgrupado(despesasAgrupadas); // Atualiza estado com dados agrupados
    } catch (error) {
      console.error("Erro ao buscar documentos de despesas: ", error);
    }
  }

  function agruparDespesasPorTag(data: any) {
    const despesasAgrupadas = data.reduce((acc: any, item: any) => {
      const { tag, valor } = item;

      // Se a tag já existir no acumulador, somamos o valor
      if (acc[tag]) {
        acc[tag] += valor;
      } else {
        acc[tag] = valor;
      }
      return acc;
    }, {});

    return despesasAgrupadas;
  }

  useEffect(() => {
    async function fetchData() {
      await buscarTags(); // Busque as tags
      await getTagsDespesas(); // Depois, busque e agrupe as despesas
    }

    fetchData(); // Função assíncrona dentro do useEffect

  }, [dataMesSelecionado, userInfo]);

  const tagColorMap: Record<string, string> = {
    "Roupas": "#8c11cf99",
    "Educação": "#ffea2b99",
    "Eletrônicos": "#1790d199",
    "Saúde": "#7dff6699",
    "Casa": "#f7b2e499",
    "Lazer": "#fc7e0f99",
    "Restaurante": "#ff242499",
    "Mercado": "#0b801999",
    "Serviços": "#13247d99",
    "Transporte": "#5b607599",
    "Viagem": "#69340599",
    "Outros": "#ffffff99"
  };

  function obterCorParaTag(tag: string) {
    return tagColorMap[tag] || '#000000'; // Default to black if the tag isn't found
  }

  // Pie Chart
  const dataPie = {
    labels: Object.keys(tagsDataAgrupado), // Mapeia as tags agrupadas
    datasets: [
      {
        data: Object.values(tagsDataAgrupado), // Mapeia os valores agrupados
        backgroundColor: Object.keys(tagsDataAgrupado).map(tag => obterCorParaTag(tag)), // Mapeia as cores das tags
        hoverBackgroundColor: Object.keys(tagsDataAgrupado).map(tag => obterCorParaTag(tag)), // Cores ao passar o mouse
      },
    ],
  };

  const configPie: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Remove a legenda
      },
      title: {
        display: true,
        text: 'Despesas por tags',
        color: '#ffffff',
        font: {
          size: 20,
          family: 'Arial',
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: R$${tooltipItem.raw.toFixed(2)} (${((tooltipItem.raw / despesaTotal) * 100).toFixed(2)}%)`; // Adiciona a porcentagem ao tooltip
          },
        },
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 0,
      },
      datalabels: {
        color: '#ffffff',
        formatter: (value: any, context: any) => {
          const total = context.chart._getDatasetTotal(context.datasetIndex);
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          return percentage;
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 1,
        borderColor: '#202020',
        hoverBorderWidth: 1,
        hoverBorderColor: '#101010',
        hoverOffset: 20,
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        right: 20,
        left: 20,
      },
    },
  };


  return (
    <>
      <Menu />

      <IonPage id="main-content">
        <IonContent fullscreen style={{
          '--background': 'var(--ion-background-color)', // Controla o fundo da página
          '--color': 'var(--ion-text-color)', // Controla a cor do texto
        }}>
          {/* Header */}
          <IonToolbar style={{
            '--background': 'var(--ion-background-color)', // Controla o fundo da página
            '--color': 'var(--ion-text-color)', // Controla a cor do texto
          }}>
            {/* User name */}
            <IonText className='ion-margin-left'>
              <h4 className='ion-text-start ion-margin-start'>Seja Bem-vindo</h4>
            </IonText>
            <IonButtons slot='end' className='ion-margin'>
              <IonButton onClick={toggleDarkMode}>
                {isDarkMode ? <IonIcon icon={sunnyOutline} size='large' slot="icon-only" style={{ 'color': 'var(--ion-color-secondary-contrast' }} /> : <IonIcon icon={moonOutline} slot="icon-only" size='large' style={{ 'color': 'var(--ion-color-secondary-contrast' }} />}
              </IonButton>
            </IonButtons>

            {/* Menu button */}
            <IonButtons slot='end'>
              <IonMenuButton>
                <IonIcon icon={menuOutline} size='large' />
              </IonMenuButton>
            </IonButtons>

            <IonText>
              <h1 className='nome ion-text-start ion-margin-start'>{userInfo.displayName}</h1>
            </IonText>
          </IonToolbar>

          {/* Selecão de mês */}
          <IonGrid color='dark'>
            <IonRow class="ion-justify-content-center">
              <IonCol className="ion-text-center">
                <IonButton id='trigger-button' className='select-month-btn' color={"success"}>{mesSelecionado}<IonIcon icon={chevronDownOutline} className='icon-select-month'></IonIcon></IonButton>
                <IonPopover trigger='trigger-button' alignment='center' className='select-mes'>
                  <IonContent color={"success"} className='ion-text-center year-select'>
                    <IonText>{anoSelecionado}</IonText>
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
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonCard className='card-1' style={{
                  '--background': 'var(--ion-color-primary-shade)', // Controla o fundo da página
                  '--color': 'var(--ion-text-color)', // Controla a cor do texto
                }}>
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

                        {/* Receitas */}
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
              </IonCol>
            </IonRow>
          </IonGrid>


          {/* ChartBar */}
          <IonGrid>
            <IonRow>
              <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='6' sizeXl='6'>
                <IonCard className='card-2 ion-padding' style={{
                  '--background': 'var(--ion-color-primary-shade)', // Controla o fundo da página
                  '--color': 'var(--ion-text-color)',
                }}>
                  <IonCardContent>
                    <IonText>
                      <h1 className='ion-text-start'>Balanço Mensal</h1>
                    </IonText>
                    <IonCol size='auto'>
                      <div className="chart-bar-container">
                        <Bar data={dataBar} options={optionsBar} />
                      </div>
                    </IonCol>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* ChartPie Tags */}
              <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='6' sizeXl='6'>
                <IonCard className='card-2 ion-padding' style={{
                  '--background': 'var(--ion-color-primary-shade)', // Controla o fundo da página
                  '--color': 'var(--ion-text-color)',
                }}>
                  <IonCardContent>
                    <IonText>
                      <h1 className='ion-text-start'>Despesas por tags</h1>
                    </IonText>
                    <IonCol size='auto'>
                      <div className="chart-pie-container">
                        <Doughnut data={dataPie} options={configPie} />
                      </div>
                    </IonCol>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent >

        <FooterTabBar></FooterTabBar>
      </IonPage >
    </>
  );
};

export default Home;
