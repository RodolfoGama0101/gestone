import React, { useContext, useEffect, useState } from "react";
import {
    IonHeader,
    IonTitle,
    IonContent,
    IonToolbar,
    IonCard,
    IonButtons,
    IonBackButton,
    IonInput,
    IonButton,
    IonPage,
    IonCardContent,
    IonText,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonModal,
    IonPopover,
    IonAlert
} from "@ionic/react";
import Verifica from "../firebase/verifica";
import './css/Receitas.css';
import { addDoc, collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, query, setDoc, sum, Timestamp, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addOutline, arrowBackOutline, chevronDownOutline, trashOutline } from "ionicons/icons";
import { meses } from "../variables/variables";
import { ThemeContext } from '../components/ThemeContext';

const Receitas: React.FC = () => {
    interface ReceitasData {
        id: string;
        data: Date;
        valor: number;
        descricao: string;
    }

    Verifica();

    const [data, setData] = useState<Date | null>(null);
    const [valorReceita, setValorReceita] = useState(Number);
    const [descricao, setDescricao] = useState(String);
    const [uid, setUid] = useState("");
    const [receitas, setReceitas] = useState<ReceitasData[]>(Array);
    const [receitaTotal, setReceitaTotal] = useState(Number);
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
    const [updateReceita, setUpdateReceita] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(Object);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [mesSelecionado, setMesSelecionado] = useState("");
    const { isDarkMode } = useContext(ThemeContext);

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

                // Query receita total
                const coll = collection(db, 'UserFinance');
                const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "receita"));

                const snapshot = await getAggregateFromServer(q, {
                    receitaTotal: sum('valor')
                });

                console.log(snapshot.data().receitaTotal)
                setReceitaTotal(snapshot.data().receitaTotal);
            }
        });
    });

    async function addReceita() {
        if (data) {
            // Criar uma nova data no fuso horário local sem ajuste de UTC
            const localDate = new Date(data);

            // Para garantir que a data seja salva corretamente no Firestore, precisamos ajustar o horário
            // Subtraímos o offset do fuso horário (minutos) e ajustamos para milissegundos
            const adjustedDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);

            const docRef = await addDoc(collection(db, "UserFinance"), {
                data: Timestamp.fromDate(adjustedDate), // Armazena a data corrigida
                mes: adjustedDate.getMonth(), // Use a data corrigida para o mês
                valor: Number(valorReceita),
                tipo: "receita",
                descricao: descricao,
                uid: uid
            });
        } else {
            console.error("Data não foi definida corretamente.");
        }

        setUpdateReceita(!updateReceita);
    }

    // Imprimir receitas
    useEffect(() => {
        const imprimirReceitas = async () => {
            const coll = collection(db, 'UserFinance');
            const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "receita"));
            const queryDocs = await getDocs(q);

            const receitasData = queryDocs.docs.map((doc) => {
                const docId = doc.id;
                const docData = doc.data();
                const data = new Date(docData.data.seconds * 1000);

                const combinedData = {
                    id: docId,
                    data: data,
                    valor: docData.valor,
                    descricao: docData.descricao
                };

                return combinedData;
            });

            // Ordenar as transferências por data, do mais recente para o mais antigo
            const saldoOrdenado = receitasData.sort((a, b) => b.data.getTime() - a.data.getTime());

            setReceitas(saldoOrdenado); // Atualiza o estado com as transferências ordenadas
        };

        imprimirReceitas();
    }, [uid, dataMesSelecionado, updateReceita]);

    async function excluirReceita(id: any) {
        await deleteDoc(doc(db, "UserFinance", id));
        setUpdateReceita(!updateReceita);
    }

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

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'success'}>
                    <IonButtons slot="start">
                        {/* <IonBackButton defaultHref="/Home" color={'light'}></IonBackButton> */}
                        <IonButton href="/Home" fill="clear">
                            <IonIcon aria-hidden="true" slot="icon-only" icon={arrowBackOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Receitas</IonTitle>
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
                                <h1 className="ion-margin receita">R$ {receitaTotal.toFixed(2)}</h1>
                            </IonText>
                        </IonCol>
                        <IonCol size="auto" className="ion-justify-content-end ion-align-self-center">
                            <IonButton shape="round" className="btn-add" color={"success"} onClick={() => setIsOpen(true)}><IonIcon icon={addOutline} slot="icon-only" /></IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonCard className="card-add-receita" style={{
                    '--background': 'var(--ion-color-primary-shade)', // Controla o fundo da página
                    '--color': 'var(--ion-text-color)', // Controla a cor do texto
                }}>
                    <IonModal isOpen={isOpen} backdropDismiss={false}>
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
                                <IonInput required label="R$:" type="number" color={'success'} className="input " fill='outline' onIonChange={(e: any) => setValorReceita(e.target.value)} />
                                <IonInput
                                    required
                                    label="Data: "
                                    type="date"
                                    color={'success'}
                                    className="input "
                                    fill="outline"
                                    onIonChange={(e: any) => {
                                        const selectedDate = new Date(e.detail.value);
                                        setData(selectedDate);
                                    }}
                                />
                                <IonInput required label="Descrição:" type="text" color={'success'} className="input" fill="outline" onIonChange={(e: any) => setDescricao(e.target.value)}></IonInput>
                                <IonButton className="btn-add-receita" color={'success'} onClick={() => { addReceita(), setIsOpen(false) }}>Adicionar receita</IonButton>
                            </IonCardContent>
                        </IonContent>
                    </IonModal>

                    {/* FAZER UM ION MODAL PARA A FUNÇÃO ADICIONAR RECEITA */}

                    {/* Selecão de mês */}
                    <IonGrid style={{
                        '--background': 'var(--ion-background-color)', // Controla o fundo da página
                        '--color': 'var(--ion-text-color)', // Controla a cor do texto
                    }}>
                        <IonRow>
                            <IonCol className="ion-text-center ion-align-self-center">
                                <IonButton id='trigger-button' className='select-month-btn' color={"success"}>{mesSelecionado}<IonIcon icon={chevronDownOutline} className='icon-select-month'></IonIcon></IonButton>
                                <IonPopover trigger='trigger-button' alignment='center' className='select-mes'>
                                    <IonContent color={"success"} className='ion-text-center year-select'>
                                        <IonText>2024</IonText>
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


                    <IonCardContent color={"success"}>
                        <IonList className="ion-no-padding">
                            {receitas.map(receita => {
                                return (
                                    <IonItem key={receita.id} style={{
                                        '--background': 'var(--ion-background-color)', // Controla o fundo da página
                                        '--color': 'var(--ion-text-color)', // Controla a cor do texto
                                    }}>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol>
                                                    <IonText><h1>{"R$ " + receita.valor.toFixed(2)}</h1></IonText>
                                                    <IonText><p>{receita.data.toLocaleDateString()}</p></IonText>
                                                    <IonText><p>{receita.descricao}</p></IonText>
                                                </IonCol>
                                                <IonCol size="auto" className="ion-justify-content-end ion-align-self-center">
                                                        <IonButton id={`present-alert-${receita.id}`} color="danger" className="delete-bt">
                                                            <IonIcon icon={trashOutline} color={'light'}></IonIcon>
                                                            <IonText color={'light'}>Excluir</IonText>
                                                        </IonButton>
                                                        <IonAlert
                                                            trigger={`present-alert-${receita.id}`} 
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
                                                                        excluirReceita(receita.id);
                                                                    },
                                                                }
                                                            ]}
                                                        />
                                                    </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonItem>
                                )
                            })}
                        </IonList>
                    </IonCardContent>
                </IonCard>
            </IonContent >
        </IonPage >
    )
}

export default Receitas;