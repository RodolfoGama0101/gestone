import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip, PointElement, LineElement } from "chart.js";
import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import './css/Charts.css';
import Verifica from '../firebase/verifica';
import { ThemeContext } from '../components/ThemeContext';
import { useContext, useEffect, useState } from 'react';
import { collection, doc, getAggregateFromServer, getDoc, getDocs, query, sum, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { chevronBackOutline, chevronForwardOutline, ellipse } from "ionicons/icons";
import { Swiper, SwiperSlide } from 'swiper/react';

interface DespesasData {
  valor: number;
  tag: string;
}

// Registrando os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

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
  const [despesasAnoAgrupadas, setDespesasAnoAgrupadas] = useState<number[]>(Array(12).fill(0)); // Array para armazenar as despesas por mês

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
    await buscarDespesasAno(user);
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

  // Função para buscar despesas do ano e agrupar por mês
  async function buscarDespesasAno(user: any) {
    const collDespesas = collection(db, 'UserFinance');
    const qDespesas = query(collDespesas,
      where("uid", "==", user.uid),
      where("tipo", "==", "despesa"),
      // where("ano", "==", new Date().getFullYear()) // Filtro para o ano atual
    );

    try {
      const querySnapshot = await getDocs(qDespesas);
      const despesasPorMes = Array(12).fill(0); // Inicializa um array com 12 zeros para cada mês

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const valor = data.valor;
        const mes = data.mes; // Assumindo que o mês é salvo como um número (0 para janeiro, 11 para dezembro)

        despesasPorMes[mes] += valor; // Soma o valor da despesa ao mês correspondente
      });

      setDespesasAnoAgrupadas(despesasPorMes); // Atualiza o estado com as despesas agrupadas por mês
      setDespesaTotal(despesasPorMes.reduce((acc, val) => acc + val, 0)); // Calcula o total de despesas
    } catch (error) {
      console.error("Erro ao buscar documentos de despesas do ano: ", error);
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
              <IonCol style={{ display: "flex", flexDirection: "row" }}>
                <IonIcon icon={ellipse} style={{ color: obterCorParaTag(tag) }} className="ion-margin" />
                <IonText>
                  <p>{tag}: R$ {valor.toFixed(2)} ({porcentagem}%)</p>
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonLabel>
      </IonItem>
    );
  });

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
    maintainAspectRatio: true, // Mantém a proporção do gráfico
    responsive: true, // O gráfico será responsivo
    aspectRatio: 2.5, // Mesmo aspecto utilizado no gráfico de linha
    plugins: {
      legend: {
        display: false, // Remove a legenda
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: R$${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  // Ordena as tags e os valores de despesas do menor para o maior
  const despesasOrdenadas = Object.entries(tagsDataAgrupado).sort((a, b) => a[1] - b[1]);

  // Cria arrays separados de tags e valores ordenados
  const tagsOrdenadas = despesasOrdenadas.map(([tag]) => tag);
  const valoresOrdenados = despesasOrdenadas.map(([, valor]) => valor);

  // Bar Chart por Tags (com despesas ordenadas)
  const dataBarTags = {
    labels: tagsOrdenadas, // As tags ordenadas serão as labels no eixo X
    datasets: [
      {
        label: 'Despesas por Tag',
        data: valoresOrdenados, // Valores das despesas ordenados
        backgroundColor: tagsOrdenadas.map(tag => obterCorParaTag(tag)), // Cor das barras conforme a tag
        borderColor: tagsOrdenadas.map(tag => obterCorParaTag(tag)), // Mesma cor para a borda
        borderWidth: 1,
      },
    ],
  };


  const optionsBarTags = {
    maintainAspectRatio: true,
    responsive: true,
    aspectRatio: 2.5, // Mesmo aspecto utilizado no gráfico de linha
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: R$${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  // Dados para o Line Chart (despesas por mês)
  const dataDespesasAno = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
      {
        label: 'Despesas por Mês',
        data: despesasAnoAgrupadas, // Valores agrupados por mês
        borderColor: 'rgba(197, 0, 15, 1)',
        backgroundColor: 'rgba(197, 0, 15, 0.3)',
        fill: true, // Preencher a área abaixo da linha
      },
    ],
  };

  const optionsLineBar = {
    maintainAspectRatio: true, // Mantém a proporção definida
    responsive: true, // O gráfico se ajustará dinamicamente ao contêiner
    aspectRatio: 2.5, // Aumentar a proporção para dar mais largura ao gráfico
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false, // Remove a legenda se não for necessária
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: R$${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };


  // Grafico mudar de lugar
  const [currentGraph, setCurrentGraph] = useState(0);

  const renderListaDespesas = () => (
    <IonGrid>
      {listaDespesas.map((despesa, index) => {
        if (index % 3 === 0) {
          return (
            <IonRow key={index}>
              <IonCol>{listaDespesas[index]}</IonCol>
              <IonCol>{listaDespesas[index + 1] || ''}</IonCol>
              <IonCol>{listaDespesas[index + 2] || ''}</IonCol>
            </IonRow>
          );
        }
        return null;
      })}
    </IonGrid>
  );

  // //Array
  // const graphStyle = {
  //   width: '100%',      // Para telas menores (mobile)
  //   height: '60vh',    // Altura relativa à viewport
  //   margin: '0 auto',  // Centraliza o gráfico
  //   color: 'var(--ion-text-color)', // Mantém a cor do texto
  //   maxWidth: '600px', // Limite de largura para telas maiores
  // };

  // const responsiveGraphStyle = {
  //   ...graphStyle,
  //   '@media(min-width: 768px)': { // Ajusta para tablets e desktops
  //     width: '65%',    // Ajusta a largura para telas maiores
  //     height: '70vh',  // Aumenta a altura relativa
  //   }
  // };


  // Layout Responsivo com Tamanhos Consistentes
  const graphs = [
    <div className="chart-doughnut" style={{ maxWidth: "100%", maxHeight: "500px", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
      <IonGrid>
        <IonRow>
          <IonCol sizeXs="12" sizeSm="12" sizeMd="12" sizeLg="5" sizeXl="5"
            className="ion-align-items-top"
            style={{ width: "100%" }}
          >
            <Doughnut data={dataPie} options={configPie} />
          </IonCol>

          <IonCol sizeXs="12" sizeSm="12" sizeMd="12" sizeLg="7" sizeXl="7">
            {renderListaDespesas()}
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>,

    <div className="chart-bar" style={{ maxWidth: "100%", maxHeight: "400px", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
      {/* Controlando o tamanho do gráfico de barras */}
      <Bar data={dataBar} options={optionsBar} />
    </div>,

    <div className="chart-bar-tags" style={{ maxWidth: "100%", maxHeight: "400px", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
      {/* Controlando o tamanho do gráfico de barras com tags */}
      <Bar data={dataBarTags} options={optionsBarTags} />
    </div>,

    <div className="chart-line" style={{ maxWidth: "100%", maxHeight: "400px", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
      {/* Controlando o tamanho do gráfico de linha */}
      <Line data={dataDespesasAno} options={optionsLineBar} />
    </div>,
  ];

  // Funções para navegação
  const proxGraph = () => {
    setCurrentGraph((prev) => (prev + 1) % graphs.length);
  };

  const antGraph = () => {
    setCurrentGraph((prev) => (prev - 1 + graphs.length) % graphs.length);
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{
            '--background': 'var(--ion-background-color)', // Controla o fundo da página
            '--color': 'var(--ion-text-color)', // Controla a cor do texto
          }}
          color={"dark"}
        >
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Home" />
          </IonButtons>
          <IonTitle>Gráficos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        style={{
          '--background': 'var(--ion-background-color)', // Controla o fundo da página
          '--color': 'var(--ion-text-color)', // Controla a cor do texto
        }}
      >
        <IonGrid>
          <IonRow className="ion-align-items-center">
            <IonCol className="ion-text-center">
              <IonText className="text-despesas">
                <h2>Total de despesas: R${despesaTotal.toFixed(2)}</h2>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>



            <IonCol sizeLg="11" className="ion-align-self-start ion-text-left" style={{ display: "flex", alignItems: "center" }}>
              <IonButton onClick={antGraph} color="success" shape="round">
                <IonIcon icon={chevronBackOutline} slot="icon-only" />
              </IonButton>
            </IonCol>

            <IonCol sizeLg="1" className="ion-align-self-end ion-text-right" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <IonButton onClick={proxGraph} color="success" shape="round">
                <IonIcon icon={chevronForwardOutline} slot="icon-only" />
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Conteúdo gráfico centralizado */}
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" className="ion-text-center">
              {graphs[currentGraph]}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Charts;