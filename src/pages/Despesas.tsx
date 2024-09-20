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
} from "@ionic/react";
import Verifica from "../firebase/verifica";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, query, setDoc, sum, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { chevronDownOutline, trashOutline } from "ionicons/icons";
import "./Despesas.css"
import { meses } from "../variables/variables";

const Despesas: React.FC = () => {
    Verifica();

    interface DespesasData {
        id: string;
        data: Date;
        valor: Number;
        descricao: string;
    }

    interface TagsData {
        tag: string[]
    }

    const [data, setData] = useState(new Date());
    const [valorDespesa, setValorDespesa] = useState(Number);
    const [descricao, setDescricao] = useState();
    const [uid, setUid] = useState("");
    const [despesas, setDespesas] = useState<DespesasData[]>(Array);
    const [despesaTotal, setDespesaTotal] = useState(Number);
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
    const [updateDespesa, setUpdateDespesa] = useState(false);
    const [tags, setTags] = useState<TagsData[]>(Array);
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

                const coll = collection(db, 'UserFinance');
                const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));

                const snapshot = await getAggregateFromServer(q, {
                    despesaTotal: sum('valor')
                });

                setDespesaTotal(snapshot.data().despesaTotal);
            }
        });
    });

    async function addDespesa() {
        const dateTime = new Date(data).getTime();

        const docRef = await addDoc(collection(db, "UserFinance"), {
            data: new Date(data),
            mes: new Date(data).getMonth(),
            valor: Number(valorDespesa),
            tipo: "despesa",
            descricao: descricao,
            uid: uid
        });

        // window.alert("Despesa adicionada com sucesso!");
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
                    descricao: docData.descricao
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
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Despesas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent color={'dark'}>
                <IonGrid fixed={false}>
                    <IonText>
                        <h1 className="ion-margin">{despesaTotal}</h1>
                    </IonText>
                    <IonRow class="ion-justify-content-center">
                        <IonCard color={'dark2'} className="card-add-receita">
                            <IonCardContent>
                                <IonInput label="R$" type="number" className="input" fill="outline" onIonChange={(e: any) => setValorDespesa(e.target.value)} />
                                <IonInput label="Data: " type="date" className="input" fill="outline" onIonChange={(e: any) => setData(e.target.value)} />
                                <IonSelect placeholder="Adicione uma tag" fill="outline" interface="popover" className="input">
                                    {tags.map(tag => {
                                        return (
                                            <IonSelectOption>{ tag.toString() }</IonSelectOption>
                                        )
                                    })}
                                </IonSelect>

                                <IonButton className="btn-add-receita" color={'danger'} onClick={() => { addDespesa() }}>Adicionar despesa</IonButton>
                            </IonCardContent>

                            {/* Selecão de mês */}
                            <IonGrid color='dark'>
                                <IonRow class="ion-justify-content-center">
                                    <IonCol className="ion-text-center">
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
                                    <IonCardContent className="card-content-despesas">
                                        <IonList color={"dark"} className="ion-no-padding list-despesas">
                                            {despesas.map(despesa => {
                                                return (
                                                    <IonItem key={despesa.id} color={"dark2"}>
                                                        <IonCardContent>
                                                            <IonCardTitle>{"R$ " + despesa.valor}</IonCardTitle>
                                                            <IonCardSubtitle>{despesa.data.toLocaleDateString()}</IonCardSubtitle>
                                                            <IonCardContent>{despesa.descricao}</IonCardContent>
                                                            <IonButton onClick={() => { excluirDespesa(despesa.id) }} color={"dark"}><IonIcon icon={trashOutline} color={'danger'}></IonIcon><IonText color={'danger'}>Excluir</IonText></IonButton>
                                                        </IonCardContent>
                                                    </IonItem>
                                                )
                                            })}
                                        </IonList>
                                    </IonCardContent>

                                </IonCard>
                            </IonCardContent>
                        </IonCard>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default Despesas;