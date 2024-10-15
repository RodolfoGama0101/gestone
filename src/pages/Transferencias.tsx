import { IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemDivider, IonList, IonPage, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, query, sum, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { createOutline, trashOutline } from "ionicons/icons";
import Verifica from "../firebase/verifica";
import { onAuthStateChanged } from "firebase/auth";
import "./css/Transferencias.css"
import { ThemeContext } from '../components/ThemeContext';

const Transferencias: React.FC = () => {
    Verifica();

    interface SaldoData {
        id: string;
        data: Date;
        valor: number;
        tipo: string;
        descricao: string;
    }

    const [uid, setUid] = useState("");
    const [saldo, setSaldo] = useState<SaldoData[]>(Array);
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
    const [updateSaldo, setUpdateSaldo] = useState(false);
    const [valorTotalReceitas, setValorTotalReceitas] = useState(Number)
    const [valorTotalDespesas, setValorTotalDespesas] = useState(Number)
    const { isDarkMode } = useContext(ThemeContext);
    const [filtroTipo, setFiltroTipo] = useState<'tudo' | 'receita' | 'despesa'>('tudo'); // Estado para o filtro


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
            const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado));
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
                    descricao: docData.descricao
                };
            });

            // Ordenar as transferências por data, do mais recente para o mais antigo
            const saldoOrdenado = saldoData.sort((a, b) => b.data.getTime() - a.data.getTime());

            setSaldo(saldoOrdenado); // Atualiza o estado com as transferências ordenadas
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
    });

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
                                <h1 className="ion-margin saldo-total-tf">R$ {valorTotalReceitas - valorTotalDespesas}</h1>
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
                        <IonCol>
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
                                const cor = transferencia.tipo === "receita" ? "success" : "";
                                return (
                                    <IonItem key={transferencia.id} style={{
                                        '--background': 'var(--ion-background-color)', // Controla o fundo da página
                                        '--color': 'var(--ion-text-color)', // Controla a cor do texto
                                    }}>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol>
                                                    <IonText color={cor}>
                                                        <h1 className="ion-no-padding">{"R$ " + negativo + transferencia.valor}</h1>
                                                    </IonText>

                                                    <IonText>
                                                        <p className="ion-no-margin">{transferencia.data.toLocaleDateString()}</p>
                                                    </IonText>

                                                    <IonText>
                                                        <p className="ion-no-margin">{transferencia.descricao}</p>
                                                    </IonText>
                                                </IonCol>
                                                <IonCol size="auto">
                                                    {/* Edit button */}
                                                    <IonButton onClick={() => { }} className="edit-btn" style={{
                                                        '--background': 'var(--ion-background-color)', // Controla o fundo da página
                                                        '--color': 'var(--ion-text-color)', // Controla a cor do texto
                                                    }}>
                                                        <IonIcon icon={createOutline} ></IonIcon>
                                                        <IonText >Editar</IonText>
                                                    </IonButton>
                                                    {/* Delete button */}
                                                    <IonButton id="present-alert" color={"danger"} className="delete-bt">
                                                        <IonIcon icon={trashOutline}></IonIcon>
                                                        <IonText color={'light'}>Excluir</IonText>
                                                    </IonButton>
                                                    <IonAlert
                                                        trigger="present-alert"
                                                        header="Tem certeza que deseja excluir"
                                                        className="custom-alert"
                                                        buttons={[
                                                            {
                                                                text: 'cancel',
                                                                cssClass: 'alert-button-cancel',

                                                            },
                                                            {
                                                                text: 'confirm',
                                                                cssClass: 'alert-button-confirm',
                                                                handler: () => {
                                                                    excluirTransferencia(transferencia.id);
                                                                },
                                                            }
                                                        ]}
                                                    ></IonAlert>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonItem>
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