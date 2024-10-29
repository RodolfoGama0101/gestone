import { IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonLoading, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, limit, orderBy, query, sum, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { airplaneOutline, bookOutline, calendarOutline, carOutline, carSportOutline, cartOutline, cashOutline, createOutline, filterOutline, funnelOutline, gameControllerOutline, hammerOutline, helpOutline, homeOutline, laptopOutline, medicalOutline, medkitOutline, restaurantOutline, shirtOutline, text, trashOutline } from "ionicons/icons";
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
    const [limite, setLimite] = useState(20);
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
                limit(limite) // Limitar o número de resultados
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
    }, [uid, dataMesSelecionado, updateSaldo, limite]);

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
                    <IonRow style={{display: "flex", alignItems: 'center'}}>
                        <IonCol>
                            <IonText>
                                <h1 className="ion-margin saldo-total-tf">R$ {(valorTotalReceitas - valorTotalDespesas).toFixed(2)}</h1>
                            </IonText>
                        </IonCol>
                        <IonCol size="auto" className="ion-justify-content-end">
                            <IonButton color={"success"} href="receitas">Nova Receita</IonButton>
                            <IonButton color={"danger"} href="despesas">Nova Despesa</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonToolbar style={{ maxWidth: '1800px', marginLeft: '5px', marginRight: '5px' }}>
                    <IonGrid>
                        <IonRow>

                            <IonButton color={filtroTipo === 'tudo' ? 'primary' : 'medium'} onClick={() => setFiltroTipo('tudo')}>
                                Todas
                            </IonButton>

                            <IonButton color={filtroTipo === 'receita' ? 'success' : 'medium'} onClick={() => setFiltroTipo('receita')}>
                                Receitas
                            </IonButton>

                            <IonButton color={filtroTipo === 'despesa' ? 'danger' : 'medium'} onClick={() => setFiltroTipo('despesa')}>
                                Despesas
                            </IonButton>

                            <IonCol sizeLg="7"></IonCol>
                            <IonCol></IonCol>

                            <IonCol className="ion-justify-content-end" style={{ display: "flex", alignItems: "center" }}>
                                <IonIcon icon={filterOutline} size="large" style={{ marginRight: "8px" }} />
                                {/* Add a single button to toggle the filter */}
                                <IonSelect className="filter-select" aria-label="Limite" interface="popover" placeholder="Limite" onIonChange={e => setLimite(Number(e.detail.value))}>
                                    <IonSelectOption value="10">10</IonSelectOption>
                                    <IonSelectOption value="20">20</IonSelectOption>
                                    <IonSelectOption value="30">30</IonSelectOption>
                                    <IonSelectOption value="40">40</IonSelectOption>
                                    <IonSelectOption value="100">100</IonSelectOption>
                                </IonSelect>
                            </IonCol>

                            <IonCol className="ion-justify-content-end" style={{ display: "flex", alignItems: "center" }}>
                                <IonIcon icon={funnelOutline} size="large" style={{ marginRight: "8px" }} />
                                {/* Add a single button to toggle the filter */}
                                <IonSelect className="filter-select" aria-label="Ordenar" interface="popover" placeholder="Ordenar" value={filtroOrdenacao} onIonChange={e => setFiltroOrdenacao(e.detail.value as 'data' | 'valor')}>
                                    <IonSelectOption value="data">Data</IonSelectOption>
                                    <IonSelectOption value="valor">Valor</IonSelectOption>
                                </IonSelect>
                            </IonCol>


                        </IonRow>
                    </IonGrid>
                </IonToolbar>

                <IonCard color={"medium"} style={{ maxWidth: '1800px' }}>
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
                                        <IonItem key={transferencia.id}>
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol size="auto" style={{ display: "flex", alignItems: "center", marginLeft: "0" }} className="ion-margin">
                                                        <IonText className="ion-text-center" style={{ display: 'flex', justifyContent: 'center' }}>
                                                            {transferencia.tipo === "receita" ? (
                                                                <IonIcon icon={cashOutline} style={{ fontSize: '28px' }} /> // Move the icon to the left and remove the marginLeft
                                                            ) : (
                                                                <IonIcon icon={tagIconMap[transferencia.tag] || helpOutline} style={{ fontSize: '28px' }} />
                                                            )}
                                                        </IonText>
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonText color={cor}>
                                                            <h1 className="">{negativo + "R$ " + transferencia.valor}</h1>
                                                        </IonText>
                                                        <IonText><p>{transferencia.data.toLocaleDateString()}</p></IonText>
                                                        <IonText>
                                                            <p className="ion-no-margin">{descricaoOrTag}</p>
                                                        </IonText>
                                                    </IonCol>
                                                    <IonCol size="auto" className="ion-justify-content-end ion-align-self-center">
                                                        <IonButton id={`present-alert-${transferencia.id}`} color="danger" className="delete-bt">
                                                            <IonIcon icon={trashOutline} color={'light'}/>
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
                                                </IonRow>
                                            </IonGrid>
                                        </IonItem>
                                    </IonGrid>
                                )
                            })}
                        </IonList>

                        {/* <IonCol size="auto" className="ion-justify-content-end">
                            <IonButton color={"dark"} onClick={() => setLimite(limite + 10)}>
                                Carregar Mais
                            </IonButton>
                        </IonCol> */}
                    </IonCardContent>

                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default Transferencias;