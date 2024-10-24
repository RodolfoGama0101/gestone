import { IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonLoading, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, orderBy, query, sum, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { airplaneOutline, bookOutline, calendarOutline, carOutline, carSportOutline, cartOutline, cashOutline, createOutline, funnelOutline, gameControllerOutline, hammerOutline, helpOutline, homeOutline, laptopOutline, medicalOutline, medkitOutline, restaurantOutline, shirtOutline, text, trashOutline } from "ionicons/icons";
import Verifica from "../firebase/verifica";
import { onAuthStateChanged } from "firebase/auth";
import "./css/Transferencias.css"
import { ThemeContext } from '../components/ThemeContext';

interface SaldoData {
    id: string;
    data: Date;
    valor: number;
    tipo: string;
    descricao: string;
    tag: string;
}

const Transferencias: React.FC = () => {
    Verifica();

    const [uid, setUid] = useState("");
    const [saldo, setSaldo] = useState<SaldoData[]>(Array);
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
    const [updateSaldo, setUpdateSaldo] = useState(false);
    const [valorTotalReceitas, setValorTotalReceitas] = useState(Number)
    // const [isOpen, setIsOpen] = useState(false);
    const [valorTotalDespesas, setValorTotalDespesas] = useState(Number)
    const { isDarkMode } = useContext(ThemeContext);
    const [filtroTipo, setFiltroTipo] = useState<'tudo' | 'receita' | 'despesa'>('tudo'); // Estado para o filtro
    const [filtroOrdenacao, setFiltroOrdenacao] = useState<'data' | 'valor'>('data'); // Estado para a ordenação
    // const [transferenciaSelecionada, setTransferenciaSelecionada] = useState<SaldoData | null>(null);

    // // Edit Finance
    // const [newData, setNewData] = useState<Date | null>(null);
    // const [newDescricao, setNewDescricao] = useState(String);
    // const [newTag, setNewTag] = useState(String);
    // const [newValor, setNewValor] = useState(Number);
    // const [tipoAtual, setTipoAtual] = useState(""); // Estado para armazenar o tipo atual de transferência
    // const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                setUid(uid);

                // Mês selecionado
                const docRefMesSelecao = doc(db, "MesSelecao", uid);
                const docSnapMesSelecao = await getDoc(docRefMesSelecao);

                if (docSnapMesSelecao.exists()) {
                    const selecaoMes = docSnapMesSelecao.data().mes;

                    setDataMesSelecionado(selecaoMes);
                }

                // Valor total receitas
                const collReceitas = collection(db, 'UserFinance');
                const qReceitas = query(collReceitas, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "receita"));

                const snapshotReceitas = await getAggregateFromServer(qReceitas, {
                    receitaTotal: sum('valor')
                });

                setValorTotalReceitas(snapshotReceitas.data().receitaTotal);

                // Valor total despesas
                const collDespesas = collection(db, 'UserFinance');
                const qDespesas = query(collDespesas, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));

                const snapshotDespesas = await getAggregateFromServer(qDespesas, {
                    despesaTotal: sum('valor')
                });

                setValorTotalDespesas(snapshotDespesas.data().despesaTotal);
            }
        });
    });

    useEffect(() => {
        const imprimirTransferencias = async () => {
            const coll = collection(db, 'UserFinance');
            const q = query(coll,
                where("uid", "==", uid),
                where("mes", "==", dataMesSelecionado),
                orderBy("data", "desc"), // Ordenar por data
            );
            const queryDocs = await getDocs(q);

            // Mapeamos os dados para a estrutura SaldoData
            const saldoData = queryDocs.docs.map((doc) => {
                const docId = doc.id;
                const docData = doc.data();
                const data = new Date(docData.data.seconds * 1000); // Converter timestamp para data

                return {
                    id: docId,
                    data: data,
                    valor: docData.valor,
                    tipo: docData.tipo,  // "receita" ou "despesa"
                    descricao: docData.descricao,
                    tag: docData.tag
                };
            });

            // Ordenar as transferências por data, do mais recente para o mais antigo
            // const saldoOrdenado = saldoData.sort((a, b) => b.data.getTime() - a.data.getTime());

            setSaldo(saldoData); // Atualiza o estado com as transferências ordenadas
        };

        imprimirTransferencias();
    }, [uid, dataMesSelecionado, updateSaldo]);

    async function excluirTransferencia(id: any) {
        await deleteDoc(doc(db, "UserFinance", id));

        setUpdateSaldo(!updateSaldo);
    }

    // Função para filtrar transferências
    const transferenciasFiltradas = saldo.filter((transf) => {
        if (filtroTipo === 'tudo') {
            return true; // Mostra todas as transferências
        }
        return transf.tipo === filtroTipo; // Filtra por tipo (receita ou despesa)
    }).sort((a, b) => {
        if (filtroOrdenacao === 'data') {
            return b.data.getTime() - a.data.getTime(); // Ordenar por data, do mais recente para o mais antigo
        }
        return b.valor - a.valor; // Ordenar por valor, do maior para o menor
    });

    const tagIconMap: Record<string, string> = {
        "Roupas": shirtOutline,
        "Educação": bookOutline,
        "Eletrônicos": laptopOutline,
        "Saúde": medkitOutline,
        "Casa": homeOutline,
        "Lazer": gameControllerOutline,
        "Restaurante": restaurantOutline,
        "Mercado": cartOutline,
        "Serviços": hammerOutline,
        "Transporte": carOutline,
        "Viagem": airplaneOutline,
        "Outros": helpOutline,
    };

    // const editFinance = async (
    //     id: any,
    //     tipo: any,
    //     newData: any,
    //     newValor: number,
    //     newDescricao: string,
    //     newTag: string,
    // ) => {
    //     const userFinanceRef = doc(db, "UserFinance", id);
    //     try {
    //         if (tipo === "receita") {
    //             await updateDoc(userFinanceRef, {
    //                 data: newData,
    //                 valor: newValor,
    //                 descricao: newDescricao,
    //             });
    //         } else if (tipo === "despesa") {
    //             await updateDoc(userFinanceRef, {
    //                 data: newData,
    //                 valor: newValor,
    //                 tag: newTag,
    //             });
    //         }



    //     } catch (error) {
    //         console.error(error)
    //     } finally {
    //         setIsLoading(false); // Finaliza o carregamento
    //     }
    // };

    // // Atualize a função de edição para definir a transferência selecionada
    // const handleEditClick = (transferencia: SaldoData) => {
    //     setTransferenciaSelecionada(transferencia);
    //     setNewData(transferencia.data);
    //     setNewDescricao(transferencia.descricao);
    //     setNewTag(transferencia.tag);
    //     setNewValor(transferencia.valor);
    //     setTipoAtual(transferencia.tipo);
    //     setIsOpen(true);
    //     editFinance(transferencia.id, transferencia.tipo, newData, newValor, newDescricao, newTag);
    // };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'medium'}>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Transferências</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent style={{
                '--background': 'var(--ion-background-color)', // Controla o fundo da página
                '--color': 'var(--ion-text-color)', // Controla a cor do texto
            }}>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonText>
                                <h1 className="ion-margin saldo-total-tf">R$ {(valorTotalReceitas - valorTotalDespesas).toFixed(2)}</h1>
                            </IonText>
                        </IonCol>
                        <IonCol size="auto" className="ion-justify-content-end ion-margin">
                            <IonButton color={"success"} href="receitas">Nova Receita</IonButton>
                            <IonButton color={"danger"} href="despesas">Nova Despesa</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonGrid>
                    <IonRow>
                        <IonCol style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <IonButton
                                color={filtroTipo === 'tudo' ? 'primary' : 'medium'}
                                onClick={() => setFiltroTipo('tudo')}
                            >
                                Todas
                            </IonButton>
                            <IonButton
                                color={filtroTipo === 'receita' ? 'success' : 'medium'}
                                onClick={() => setFiltroTipo('receita')}
                            >
                                Receitas
                            </IonButton>
                            <IonButton
                                color={filtroTipo === 'despesa' ? 'danger' : 'medium'}
                                onClick={() => setFiltroTipo('despesa')}
                            >
                                Despesas
                            </IonButton>
                        </IonCol>

                        <IonCol size="auto" className="ion-justify-content-end">
                            {/* Add a single button to toggle the filter */}
                            <IonSelect className="filter-select" aria-label="Order" interface="popover" placeholder="Order" label="" value={filtroOrdenacao} onIonChange={e => setFiltroOrdenacao(e.detail.value as 'data' | 'valor')}>
                                <IonSelectOption value="data">Data</IonSelectOption>
                                <IonSelectOption value="valor">Valor</IonSelectOption>
                            </IonSelect>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonCard color={"medium"}>
                    <IonCardContent>
                        
                        <IonList className="ion-no-padding list-transferencias" style={{
                            '--background': 'var(--ion-background-color)', // Controla o fundo da página
                            '--color': 'var(--ion-text-color)', // Controla a cor do texto
                        }}>
                            {transferenciasFiltradas.map(transferencia => {
                                const negativo = transferencia.tipo === "receita" ? "+" : "-";
                                const cor = transferencia.tipo === "receita" ? "success" : "danger";
                                const descricaoOrTag = transferencia.tipo === "receita" ? transferencia.descricao : transferencia.tag;
                                // const corModal = transferenciaSelecionada?.tipo === "receita" ? "success" : "danger";

                                return (
                                    <IonGrid>
                                        {/* Ícone */}
                                        <IonItem key={transferencia.id}>
                                            <IonCol sizeLg="1">
                                                <IonText>
                                                    {transferencia.tipo === "receita" ? (
                                                        <IonIcon icon={cashOutline} style={{ fontSize: '24px', marginRight: '8px' }}  // Diminui o ícone e adiciona espaço entre ícone e texto
                                                        />

                                                    ) : (
                                                        // Exibir ícone da tag correspondente
                                                        <IonIcon icon={tagIconMap[transferencia.tag] || helpOutline} style={{ fontSize: '24px', marginRight: '8px' }} />
                                                    )}
                                                </IonText>
                                            </IonCol>

                                            {/* Valor, Descrição ou Tag */}
                                            <IonCol sizeLg="3">
                                                <IonText color={cor} className="ion-text-start">
                                                    <h2 className="ion-no-padding">{negativo + "R$ " + transferencia.valor}</h2>
                                                </IonText>

                                                <IonText>
                                                    <p className="ion-no-margin">{descricaoOrTag}</p>
                                                </IonText>
                                            </IonCol>

                                            {/* Data */}
                                            <IonCol sizeLg="3">
                                                <IonText className="ion-text-start">
                                                    <p className="ion-no-margin">{transferencia.data.toLocaleDateString()}</p>
                                                </IonText>
                                            </IonCol>

                                            {/* Editar e Excluir */}
                                            <IonCol sizeLg="6">

                                                {/* Delete button */}
                                                <IonButton id={`present-alert-${transferencia.id}`} color="danger" className="delete-bt">
                                                    <IonIcon icon={trashOutline} color={'light'}></IonIcon>
                                                    <IonText color={'light'}>Excluir</IonText>
                                                </IonButton>
                                                <IonAlert
                                                    trigger={`present-alert-${transferencia.id}`}
                                                    header="Tem certeza que deseja excluir?"
                                                    className="custom-alert"
                                                    buttons={[
                                                        {
                                                            text: 'cancel',
                                                            cssClass: 'alert-button-cancel cancel-bnt',

                                                        },
                                                        {
                                                            text: 'confirm',
                                                            cssClass: 'alert-button-confirm',
                                                            handler: () => {
                                                                excluirTransferencia(transferencia.id);
                                                            },
                                                        }
                                                    ]}
                                                />
                                            </IonCol>
                                        </IonItem>
                                    </IonGrid>
                                )
                            })}
                        </IonList>
                    </IonCardContent>

                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default Transferencias;