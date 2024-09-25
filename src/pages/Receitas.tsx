import React, { useEffect, useState } from "react";
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
import './Receitas.css';
import { addDoc, collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, query, setDoc, sum, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addOutline, chevronDownOutline, trashOutline } from "ionicons/icons";
import { meses } from "../variables/variables";

const Receitas: React.FC = () => {
    interface ReceitasData {
        id: string;
        data: Date;
        valor: number;
        descricao: string;
    }

    Verifica();

    const [data, setData] = useState(Date);
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
        const docRef = await addDoc(collection(db, "UserFinance"), {
            data: new Date(data),
            mes: new Date(data).getMonth(),
            valor: Number(valorReceita),
            tipo: "receita",
            descricao: descricao,
            uid: uid
        });

        // window.alert("Receita adicionada com sucesso!");
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

            setReceitas(receitasData);
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
                        <IonBackButton defaultHref="/Home" color={'light'}></IonBackButton>
                    </IonButtons>
                    <IonTitle>Receitas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent color={'dark'}>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonText>
                                <h1 className="ion-margin receita">R$ {receitaTotal}</h1>
                            </IonText>
                        </IonCol>
                        <IonCol size="auto" className="ion-justify-content-end ion-align-self-center">
                            <IonButton shape="round" className="btn-add" color={"success"} onClick={() => setIsOpen(true)}><IonIcon icon={addOutline} slot="icon-only" /></IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonCard color={'dark2'} className="card-add-receita">
                    <IonModal isOpen={isOpen} className="fullscreen-modal">
                        <IonHeader>
                            <IonToolbar color="success">
                                <IonTitle>Adicionar</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="ion-padding" color={'dark2'}>
                            <IonCardContent>
                                <IonInput required label="R$:" type="number" className="input" fill="outline" onIonChange={(e: any) => setValorReceita(e.target.value)} />
                                <IonInput required label="Data: " type="date" className="input" fill="outline" onIonChange={(e: any) => setData(e.target.value)} />
                                <IonInput required label="Descrição:" type="text" className="input" fill="outline" onIonChange={(e: any) => setDescricao(e.target.value)}></IonInput>
                                <IonButton className="btn-add-receita" color={'success'} onClick={() => { addReceita(), setIsOpen(false) }}>Adicionar receita</IonButton>
                            </IonCardContent>
                        </IonContent>
                    </IonModal>

                    {/* FAZER UM ION MODAL PARA A FUNÇÃO ADICIONAR RECEITA */}

                    {/* Selecão de mês */}
                    <IonGrid color='dark'>
                        <IonRow>
                            <IonCol className="ion-text-center ion-align-self-center">
                                <IonButton id='trigger-button' className='select-month-btn' color={"success"}>{mesSelecionado}<IonIcon icon={chevronDownOutline} className='icon-select-month'></IonIcon></IonButton>
                                <IonPopover trigger='trigger-button' alignment='center' className='select-mes'>
                                    <IonContent color={"success"} className='ion-text-center year-select'>
                                        <IonText>2024</IonText>
                                    </IonContent>
                                    <IonButtons>
                                        <IonList>
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
                                        </IonList>
                                    </IonButtons>
                                </IonPopover>
                            </IonCol>
                        </IonRow>
                    </IonGrid>


                    <IonCardContent color={"success"}>
                        <IonList className="ion-no-padding">
                            {receitas.map(receita => {
                                return (
                                    <IonItem key={receita.id} color={"dark"}>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol>
                                                    <IonText><h1>{"R$ " + receita.valor}</h1></IonText>
                                                    <IonText><p>{receita.data.toLocaleDateString()}</p></IonText>
                                                    <IonText><p>{receita.descricao}</p></IonText>
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
                                                                    excluirReceita(receita.id); 
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
            </IonContent >
        </IonPage >
    )
}

export default Receitas;