import { IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonList, IonModal, IonPage, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, query, sum, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { airplaneOutline, arrowUp, bookOutline, carOutline, cartOutline, cashOutline, createOutline, gameControllerOutline, hammerOutline, helpOutline, homeOutline, laptopOutline, medicalOutline, medkitOutline, restaurantOutline, shirtOutline, text, trashOutline } from "ionicons/icons";
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
        tag: string;
    }

    const [uid, setUid] = useState("");
    const [saldo, setSaldo] = useState<SaldoData[]>(Array);
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
    const [updateSaldo, setUpdateSaldo] = useState(false);
    const [valorTotalReceitas, setValorTotalReceitas] = useState(Number)
    const [isOpen, setIsOpen] = useState(false);
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
                    descricao: docData.descricao,
                    tag: docData.tag
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
                                const descricaoOrTag = transferencia.tipo === "receita" ? transferencia.descricao : transferencia.tag;
                                return (
                                    // <IonItem key={transferencia.id} style={{
                                    //     '--background': 'var(--ion-background-color)', // Controla o fundo da página
                                    //     '--color': 'var(--ion-text-color)', // Controla a cor do texto
                                    // }}>
                                    <IonGrid>

                                        <IonRow>
                                            <IonCol>
                                                <IonText>

                                                    {transferencia.tipo === "receita" ? (
                                                        <IonIcon icon={cashOutline} style={{ fontSize: '24px', marginRight: '8px' }}  // Diminui o ícone e adiciona espaço entre ícone e texto
                                                        >
                                                        </IonIcon>
                                                    ) : (
                                                        // Exibir ícone da tag correspondente
                                                        <IonIcon
                                                            icon={tagIconMap[transferencia.tag] || helpOutline} style={{ fontSize: '24px', marginRight: '8px' }}></IonIcon>
                                                    )}

                                                </IonText>
                                            </IonCol>
                                            <IonCol style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                                                <IonText>
                                                    <h2 className="ion-no-margin">{descricaoOrTag}</h2>
                                                </IonText>
                                            </IonCol>

                                            <IonCol>
                                                <IonText color={cor} className="ion-text-end">
                                                    <h2 className="ion-no-padding">{negativo + "R$ " + transferencia.valor}</h2>
                                                </IonText>
                                                <IonText className="ion-text-end">
                                                    <p className="ion-no-margin">{transferencia.data.toLocaleDateString()}</p>
                                                </IonText>
                                            </IonCol>



                                            <IonCol size="auto">
                                                {/* Edit button */}
                                                <IonButton onClick={() => { setIsOpen(true) }} className="edit-btn" style={{
                                                    '--background': 'var(--ion-background-color)', // Controla o fundo da página
                                                    '--color': 'var(--ion-text-color)', // Controla a cor do texto
                                                }}>
                                                    <IonIcon icon={createOutline} ></IonIcon>
                                                    <IonText >Editar</IonText>
                                                </IonButton>

                                                <IonModal isOpen={isOpen} className="fullscreen-modal">
                                                    <IonHeader>
                                                        <IonToolbar color="success">
                                                            <IonTitle>Adicionar</IonTitle>
                                                            <IonButtons slot="end">
                                                                <IonButton onClick={() => setIsOpen(false)}>Fechar</IonButton>
                                                            </IonButtons>
                                                        </IonToolbar>
                                                    </IonHeader>
                                                    <IonContent className="ion-padding" style={{
                                                        '--background': 'var(--ion-color-background-color)', // Controla o fundo da página
                                                        '--color': 'var(--ion-text-color)', // Controla a cor do texto
                                                    }}>
                                                        <IonCardContent>
                                                            {/* <IonInput required label="R$:" type="number" color={'success'} className="input " fill='outline' onIonChange={(e: any) => setValorReceita(e.target.value)} /> */}
                                                            <IonInput
                                                                required
                                                                label="Data: "
                                                                type="date"
                                                                color={'success'}
                                                                className="input "
                                                                fill="outline"
                                                                onIonChange={(e: any) => {
                                                                    const selectedDate = new Date(e.detail.value);
                                                                    // setData(selectedDate);
                                                                }}
                                                            />
                                                            {/* <IonInput required label="Descrição:" type="text" color={'success'} className="input" fill="outline" onIonChange={(e: any) => setDescricao(e.target.value)}></IonInput> */}
                                                            {/* <IonButton className="btn-add-receita" color={'success'} onClick={() => { addReceita(), setIsOpen(false) }}>Adicionar receita</IonButton> */}
                                                        </IonCardContent>
                                                    </IonContent>
                                                </IonModal>

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
                                        </IonRow>
                                    </IonGrid>
                                    // </IonItem>
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