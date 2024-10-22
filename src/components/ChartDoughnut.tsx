import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip } from "chart.js";
import { collection, doc, getAggregateFromServer, getDoc, getDocs, query, sum, where } from "firebase/firestore";
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./css/ChartDoughnut.css"

interface DespesasData {
    valor: number;
    tag: string;
}

// Registrando os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ChartDoughnut: React.FC = () => {
    const [userInfo, setUserInfo] = useState(Object);
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth()); // Fazer procura de mês
    const [receitaTotal, setReceitaTotal] = useState(Number);
    const [despesaTotal, setDespesaTotal] = useState(Number);
    const [tags, setTags] = useState(Object);
    const [tagsData, setTagsData] = useState<DespesasData[]>([]);
    const [tagsDataAgrupado, setTagsDataAgrupado] = useState<DespesasData[]>([]);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            setUserInfo(user);

            if (user) {
                // Soma de receitas
                const collReceitas = collection(db, 'UserFinance');
                const qReceitas = query(collReceitas, where("uid", "==", userInfo.uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "receita"));

                const snapshotReceitas = await getAggregateFromServer(qReceitas, {
                    receitaTotal: sum('valor')
                });

                setReceitaTotal(snapshotReceitas.data().receitaTotal);

                // Query despesas
                const collDespesas = collection(db, 'UserFinance');
                const qDespesas = query(collDespesas, where("uid", "==", userInfo.uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));

                // Soma despesas
                const snapshotDespesas = await getAggregateFromServer(qDespesas, {
                    despesaTotal: sum('valor')
                });

                setDespesaTotal(snapshotDespesas.data().despesaTotal);

                // Get mês selecionado
                const docRefMesSelecao = doc(db, "MesSelecao", userInfo.uid);
                const docSnapMesSelecao = await getDoc(docRefMesSelecao);

                if (docSnapMesSelecao.exists()) {
                    const selecaoMes = docSnapMesSelecao.data().mes;
                    // console.log(selecaoMes);

                    setDataMesSelecionado(selecaoMes);
                }
            }

        })
    })

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
        <div className="chart-doughnut">
            <Doughnut data={dataPie} options={configPie} />
        </div>
    );
}

export default ChartDoughnut;