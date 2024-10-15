import React, { useEffect, useState } from "react";
import {
    IonHeader,
    IonTitle,
    IonContent,
    IonToolbar,
    IonCard,
    IonButtons,
    IonBackButton,
    IonPage,
    IonCardContent,
    IonInput,
    IonButton,
    IonText,
    IonCardTitle,
    IonCardSubtitle,
    IonIcon,
    IonGrid,
    IonCol,
    IonRow,
    IonList,
    IonItem,
    IonPopover,
    IonSelectOption,
    IonSelect,
    IonModal,
    IonAlert,
} from "@ionic/react";
import Verifica from "../firebase/verifica";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, query, setDoc, sum, Timestamp, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { addOutline, arrowBackOutline, chevronDownOutline, trashOutline } from "ionicons/icons";
import "./css/Despesas.css"
import { meses } from "../variables/variables";
import { ThemeContext } from '../components/ThemeContext';


const Despesas: React.FC = () => {
    Verifica();

    interface DespesasData {
        id: string;
        data: Date;
        valor: Number;
        tag: string;
    }

    interface TagsData {
        tag: string[]
    }

    const [data, setData] = useState(new Date());
    const [valorDespesa, setValorDespesa] = useState(Number);
    const [uid, setUid] = useState("");
    const [despesas, setDespesas] = useState<DespesasData[]>(Array);
    const [despesaTotal, setDespesaTotal] = useState(Number);
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
    const [updateDespesa, setUpdateDespesa] = useState(false);
    const [tags, setTags] = useState<TagsData[]>(Array);
    const [userInfo, setUserInfo] = useState(Object);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [isOpen, setIsOpen] = useState(false);
    const [mesSelecionado, setMesSelecionado] = useState("");
    const [tagSelecao, setTagSelecao] = useState()

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

                const coll = collection(db, 'UserFinance');
                const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));

                const snapshot = await getAggregateFromServer(q, {
                    despesaTotal: sum('valor')
                });

                setDespesaTotal(snapshot.data().despesaTotal);
            }
        });
    });

    // Adicionar despesa
    async function addDespesa() {
        if (data) {
            // Criar uma nova data no fuso horário local sem ajuste de UTC
            const localDate = new Date(data);

            // Para garantir que a data seja salva corretamente no Firestore, precisamos ajustar o horário
            // Subtraímos o offset do fuso horário (minutos) e ajustamos para milissegundos
            const adjustedDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);

            const docRef = await addDoc(collection(db, "UserFinance"), {
                data: Timestamp.fromDate(adjustedDate), // Armazena a data corrigida
                mes: adjustedDate.getMonth(), // Use a data corrigida para o mês
                valor: Number(valorDespesa),
                tipo: "despesa",
                tag: tagSelecao,
                uid: uid
            });
        } else {
            console.error("Data não foi definida corretamente.");
        }

        setUpdateDespesa(!updateDespesa);
    }

    useEffect(() => {
        const imprimirDespesas = async () => {
            const coll = collection(db, 'UserFinance');
            const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));
            const queryDocs = await getDocs(q);

            const despesasData = queryDocs.docs.map((doc) => {
                const docId = doc.id;
                const docData = doc.data();
                const data = new Date(docData.data.seconds * 1000);

                const combinedData = {
                    id: docId,
                    data: data,
                    valor: docData.valor,
                    tag: docData.tag
                };

                return combinedData;
            });

            setDespesas(despesasData);
        };

        imprimirDespesas();

        async function imprimirTags() {
            const docRef = doc(db, "TagsDespesas", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTags(docSnap.data().tags || []); // Set tags or an empty array if none exist
            } else {
                console.log("No such document!");
            }
        }

        imprimirTags()
    }, [uid, dataMesSelecionado, updateDespesa])

    async function excluirDespesa(id: any) {
        await deleteDoc(doc(db, "UserFinance", id));

        setUpdateDespesa(!updateDespesa);
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
                <IonToolbar color={'danger'}>
                    <IonButtons slot="start">
                        <IonButton href="/Home" fill="clear">
                            <IonIcon aria-hidden="true" slot="icon-only" icon={arrowBackOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Despesas</IonTitle>
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
                                <h1 className="ion-margin receita">R$ {despesaTotal.toFixed(2)}</h1>
                            </IonText>
                        </IonCol>
                        <IonCol size="auto" className="ion-justify-content-end ion-align-self-center">
                            <IonButton shape="round" className="btn-add" color={"danger"} onClick={() => setIsOpen(true)}><IonIcon icon={addOutline} slot="icon-only" /></IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonCard className="card-add-receita" style={{
                    '--background': 'var(--ion-color-primary-shade)', // Controla o fundo da página
                    '--color': 'var(--ion-text-color)', // Controla a cor do texto
                }}>
                    <IonModal isOpen={isOpen} className="fullscreen-modal">
                        <IonHeader>
                            <IonToolbar color="danger">
                                <IonTitle>Adicionar</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="ion-padding" style={{
                            '--background': 'var(--ion-background-color)', // Controla o fundo da página
                            '--color': 'var(--ion-text-color)', // Controla a cor do texto
                        }}>
                            <IonInput label="R$" type="number" color={'danger'} className="input" fill="outline" onIonChange={(e: any) => setValorDespesa(e.target.value)} required />
                            <IonInput label="Data: " type="date" color={'danger'} className="input" fill="outline" onIonChange={(e: any) => setData(e.target.value)} required />
                            <IonSelect placeholder="Adicione uma tag" color={'danger'} fill="outline" interface="popover" className="input" onIonChange={(e: any) => setTagSelecao(e.target.value)}>
                                {tags.map(tag => {
                                    return (
                                        <IonSelectOption>{tag.toString()}</IonSelectOption>
                                    )
                                })}
                            </IonSelect>

                            <IonButton className="btn-add-receita" color={'danger'} onClick={() => { addDespesa(), setIsOpen(false) }}>Adicionar despesa</IonButton>
                        </IonContent>
                    </IonModal>

                    {/* Selecão de mês */}
                    <IonGrid style={{
                        '--background': 'var(--ion-background-color)', // Controla o fundo da página
                        '--color': 'var(--ion-text-color)', // Controla a cor do texto
                    }}>
                        <IonRow>
                            <IonCol className="ion-text-center ion-align-self-center">
                                <IonButton id='trigger-button' className='select-month-btn' color={"danger"}>{mesSelecionado}<IonIcon icon={chevronDownOutline} className='icon-select-month'></IonIcon></IonButton>
                                <IonPopover trigger='trigger-button' alignment='center' className='select-mes'>
                                    <IonContent color={"danger"} className='ion-text-center year-select'>
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

                    <IonCardContent>
                        <IonCard color={"danger"}>
                            <IonList className="ion-no-padding">
                                {despesas.map(despesa => {
                                    return (
                                        <IonItem key={despesa.id} style={{
                                            '--background': 'var(--ion-background-color)', // Controla o fundo da página
                                            '--color': 'var(--ion-text-color)', // Controla a cor do texto
                                        }}>
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol>
                                                        <IonCardTitle>{"R$ " + despesa.valor.toFixed(2)}</IonCardTitle>
                                                        <IonCardSubtitle>{despesa.data.toLocaleDateString()}</IonCardSubtitle>
                                                        <IonCardContent>{despesa.tag}</IonCardContent>
                                                    </IonCol>
                                                    <IonCol size="auto" className="ion-justify-content-end ion-align-self-center">
                                                        <IonButton id="present-alert" color={"danger"} className="delete-bt">
                                                            <IonIcon icon={trashOutline} color={'light'}></IonIcon>
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
                                                                        excluirDespesa(despesa.id);
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
                        </IonCard>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default Despesas;