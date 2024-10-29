import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonBackButton,
    IonContent,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonButton,
    IonAvatar,
    IonFooter,
    IonModal,
    IonInput,
    IonCard,
    IonCardContent,
} from '@ionic/react';
import "./css/Conta.css";
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import { arrowBackOutline, brushOutline, pencil, pencilOutline } from 'ionicons/icons';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

interface DespesasData {
    valor: number;
    tag: string;
}

const Conta: React.FC = () => {
    const [userImg, setUserImg] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState<string | null>(userName);
    const [newEmail, setNewEmail] = useState<string | null>(userEmail);
    const [receitaTotal, setReceitaTotal] = useState(Number);
    const [despesaTotal, setDespesaTotal] = useState(Number);
    const [despesasAnoAgrupadas, setDespesasAnoAgrupadas] = useState<number[]>(Array(12).fill(0));
    const [tagsDataAgrupado, setTagsDataAgrupado] = useState<{ [key: string]: number }>({});
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth()); // Fazer procura de mês
    const [tagsData, setTagsData] = useState<DespesasData[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserImg(user.photoURL);
                setUserName(user.displayName);
                setUserEmail(user.email);
                setNewName(user.displayName);
                setNewEmail(user.email);
                fetchData(user);
            } else {
                setUserImg(null);
                setUserName(null);
                setUserEmail(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Função para buscar e agrupar dados
    async function fetchData(user: any) {
        // await buscarTags(user);
        await getTagsDespesas(user);
        // await buscarReceitasEDespesas(user);
        await buscarMesSelecionado(user);
        await buscarDespesasAno(user);
    }

    function logout() {
        signOut(auth).then(() => {
            window.location.href = "/";
        }).catch((error) => {
            alert(error.message);
        });
    }

    const toggleEditName = () => {
        setIsEditingName(!isEditingName);
    };

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
        // scales: {
        //     x: {
        //         beginAtZero: true,
        //         ticks: {
        //             color: 'var(--ion-text-color)', // Usa a cor do texto do tema
        //         },
        //         grid: {
        //             color: 'var(--ion-text-color)', // Usa a cor da borda do tema
        //         }
        //     },
        //     y: {
        //         beginAtZero: true,
        //         ticks: {
        //             color: 'var(--ion-text-color)', // Usa a cor do texto do tema
        //         },
        //         grid: {
        //             color: 'var(--ion-text-color)', // Usa a cor da borda do tema
        //         }
        //     },
        // },
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

    const handleSaveName = async () => {
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: newName });
                setUserName(newName);
                window.alert("Nome alterado com sucesso!");
            } else {
                window.alert("Usuário não autenticado.");
            }
        } catch (error) {
            console.error("Erro ao atualizar o nome:", error);
            window.alert("Erro ao atualizar o nome.");
        } finally {
            setIsEditingName(false); // Garante que o estado de edição seja fechado
        }
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Sua Conta</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol className="user-info">
                            {userImg ? (
                                <IonAvatar className="user-photo">
                                    <IonImg src={userImg} />
                                </IonAvatar>
                            ) : (
                                <IonAvatar className="user-photo">
                                    <IonImg src="/assets/default-avatar.png" />
                                </IonAvatar>
                            )}
                        </IonCol>
                    </IonRow>

                    <IonGrid>
                        <div className="ion-text-center">
                            <h2 className="ion-text-capitalize">
                                {userName ? userName : 'Carregando...'}
                            </h2>
                            <p>{userEmail ? userEmail : 'Carregando...'}</p>
                        </div>

                        <div className="ion-text-center">
                            <IonButton onClick={() => setIsOpen(true)} className="ion-justify-content-center">
                                Editar
                            </IonButton>
                        </div>

                        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} backdropDismiss={false}>
                            <IonHeader>
                                <IonToolbar color="success">
                                    <IonButtons slot="start">
                                        <IonButton onClick={() => setIsOpen(false)}>
                                            <IonIcon aria-hidden="true" slot="icon-only" icon={arrowBackOutline} />
                                        </IonButton>
                                    </IonButtons>
                                    <IonTitle>Editar Perfil</IonTitle>
                                </IonToolbar>
                            </IonHeader>

                            <IonContent className="ion-no-padding " fullscreen>
                                <IonGrid>
                                    <IonRow className="ion-justify-content-center  ion-align-items-center ">
                                        <IonCol className='ion-text-center'>
                                            <IonAvatar className="user-photo1">
                                                <IonImg src={userImg || "/assets/default-avatar.png"} />
                                            </IonAvatar>
                                            <IonButton
                                                shape='round'
                                                className='bnt-edit'
                                            >
                                                <IonText><IonIcon color='success' icon={pencilOutline} /> Editar Avatar </IonText>
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                    {/* Edição do Nome */}

                                    <IonRow className="ion-justify-content-center ion-align-items-center ion-margin-top">
                                        <IonCol>
                                            {isEditingName ? (
                                                <IonInput
                                                    value={newName}
                                                    onIonChange={(e) => setNewName(e.detail.value!)}
                                                    placeholder="Digite o novo nome"
                                                    label='Nome: '
                                                />
                                            ) : (
                                                <IonText className="ion-text-capitalize">Nome: {userName}</IonText>
                                            )}
                                        </IonCol>

                                        <IonButton fill="clear" onClick={toggleEditName}>
                                            <IonIcon icon={brushOutline} color={'success'} />
                                        </IonButton>

                                    </IonRow>

                                    {isEditingName && (
                                        <IonRow className="ion-justify-content-center ion-margin-top">
                                            <IonButton color="success" onClick={handleSaveName}>
                                                Salvar Nome
                                            </IonButton>
                                            <IonButton color="medium" onClick={toggleEditName}>
                                                Cancelar
                                            </IonButton>
                                        </IonRow>
                                    )}
                                </IonGrid>
                            </IonContent>
                        </IonModal>
                    </IonGrid>

                    <IonGrid>
                        <IonRow style={{ display: 'flex', alignItems: 'center' }}>
                            {/* ChartPie Tags */}
                            <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='12' sizeXl='12'>

                                <IonText className='ion-text-center'>
                                    <h1>Resumo Anual</h1>
                                </IonText>
                                <IonCol size='auto'>
                                    <div className="chart-pie-container"
                                        style={{

                                            width: '100%',

                                        }}

                                        color={'medium'}
                                    >
                                        <Line data={dataDespesasAno} options={optionsLineBar} />
                                    </div>
                                </IonCol>

                            </IonCol>
                        </IonRow>
                    </IonGrid>


                </IonGrid>
            </IonContent>

            <IonFooter className="ion-no-border footer-logout">
                <IonToolbar>
                    <IonButton expand="block" color="danger" onClick={logout}>
                        Logout
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default Conta;
