import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip } from "chart.js";
import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonToolbar } from '@ionic/react';
import './css/Cadastro.css';
import Verifica from '../firebase/verifica';
import { ThemeContext } from '../components/ThemeContext';
import { useContext, useEffect, useState } from 'react';
import { collection, doc, getAggregateFromServer, getDoc, getDocs, query, sum, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Doughnut } from 'react-chartjs-2';
import { ellipse } from "ionicons/icons";

interface DespesasData {
  valor: number;
  tag: string;
}

// Registrando os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Charts: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);

  Verifica();

  const [userInfo, setUserInfo] = useState(Object);
  const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth()); // Fazer procura de mês
  const [receitaTotal, setReceitaTotal] = useState(Number);
  const [despesaTotal, setDespesaTotal] = useState(Number);
  const [tags, setTags] = useState(Object);
  const [tagsData, setTagsData] = useState<DespesasData[]>([]);
  const [tagsDataAgrupado, setTagsDataAgrupado] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo(user);
        fetchData(user); // Passa o usuário autenticado para fetchData

        console.log("Atualização!");
      }
    });
    return () => unsubscribe();
  }, [dataMesSelecionado]);

  // Função para buscar e agrupar dados
  async function fetchData(user: any) {
    await buscarTags(user);
    await getTagsDespesas(user);
    await buscarReceitasEDespesas(user);
    await buscarMesSelecionado(user);
  }

  // Função que busca receitas e despesas
  async function buscarReceitasEDespesas(user: any) {
    // Soma de receitas
    const collReceitas = collection(db, 'UserFinance');
    const qReceitas = query(collReceitas, where("uid", "==", user.uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "receita"));

    const snapshotReceitas = await getAggregateFromServer(qReceitas, {
      receitaTotal: sum('valor')
    });
    setReceitaTotal(snapshotReceitas.data().receitaTotal);

    // Soma despesas
    const collDespesas = collection(db, 'UserFinance');
    const qDespesas = query(collDespesas, where("uid", "==", user.uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));

    const snapshotDespesas = await getAggregateFromServer(qDespesas, {
      despesaTotal: sum('valor')
    });

    setDespesaTotal(snapshotDespesas.data().despesaTotal);
  }

  async function buscarMesSelecionado(user: any) {
    // Get mês selecionado
    const docRefMesSelecao = doc(db, "MesSelecao", user.uid);
    const docSnapMesSelecao = await getDoc(docRefMesSelecao);

    if (docSnapMesSelecao.exists()) {
      const selecaoMes = docSnapMesSelecao.data().mes;
      // console.log(selecaoMes);

      setDataMesSelecionado(selecaoMes);
    }
  }

  // Tag query
  async function buscarTags(user: any) {
    const docRef = doc(db, "TagsDespesas", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let tagData = docSnap.data();
      setTags(tagData.tags);
    } else {
      console.log("No such document!");
    }
  }

  async function getTagsDespesas(user: any) {
    const collDespesas = collection(db, 'UserFinance');
    const qDespesas = query(collDespesas,
      where("uid", "==", user.uid),
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

  // Renderizando a lista de despesas com porcentagem
  const listaDespesas = Object.keys(tagsDataAgrupado).map((tag: string) => {
    const valor = tagsDataAgrupado[tag]; // TypeScript agora sabe que `valor` é do tipo `number`
    const porcentagem = ((valor / despesaTotal) * 100).toFixed(2); // Calcula a porcentagem

    return (
      <IonItem key={tag}>
        <IonLabel>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonText>
                  <IonIcon icon={ellipse} style={{ color: obterCorParaTag(tag) }} />
                  <p>{tag}: R$ {valor.toFixed(2)} ({porcentagem}%)</p>
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonLabel>
      </IonItem>
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
          '--background': 'var(--ion-background-color)', // Controla o fundo da página
          '--color': 'var(--ion-text-color)', // Controla a cor do texto
        }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Home"></IonBackButton>
          </IonButtons>
          <IonText>
            <h1 className='ion-margin'>Gráficos</h1>
          </IonText>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{
        '--background': 'var(--ion-background-color)', // Controla o fundo da página
        '--color': 'var(--ion-text-color)', // Controla a cor do texto
      }}>

        <IonGrid>
          <IonRow>
            <IonCol>
              <div className="chart-doughnut">
                <Doughnut data={dataPie} options={configPie} />
              </div>
            </IonCol>

            <IonCol>
              <IonText>
                <h1>Total de despesas: R${despesaTotal.toFixed(2)}</h1>
              </IonText>
              <IonList>{listaDespesas}</IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Charts;