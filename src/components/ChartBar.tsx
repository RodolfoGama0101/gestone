import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { collection, getAggregateFromServer, query, sum, where } from "firebase/firestore";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrando os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ChartBar: React.FC = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [receitaTotal, setReceitaTotal] = useState<number>(0);
    const [despesaTotal, setDespesaTotal] = useState<number>(0);
    const [dataMesSelecionado, setDataMesSelecionado] = useState<number>(new Date().getMonth());

    useEffect(() => {
        const fetchData = async () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserInfo(user);
                    const uid = user.uid;

                    // Receita
                    const collReceitas = collection(db, 'UserFinance');
                    const qReceitas = query(collReceitas, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "receita"));

                    const snapshotReceitas = await getAggregateFromServer(qReceitas, {
                        receitaTotal: sum('valor')
                    });

                    setReceitaTotal(snapshotReceitas.data().receitaTotal || 0);

                    // Despesa
                    const collDespesas = collection(db, 'UserFinance');
                    const qDespesas = query(collDespesas, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));

                    const snapshotDespesas = await getAggregateFromServer(qDespesas, {
                        despesaTotal: sum('valor')
                    });

                    setDespesaTotal(snapshotDespesas.data().despesaTotal || 0);
                } else {
                    window.location.href = '/login';
                }
            });
        };

        fetchData();
    }, [dataMesSelecionado])



    // Dados do gráfico
    const data = {
        labels: ['Receitas', 'Despesas'],
        datasets: [{
            label: 'Finanças do mês',
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

    const options = {
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
    };

    return (
        <div className="chart-bar-container">
            <Bar data={data} options={options} />
        </div>
    );
}

export default ChartBar;