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
    IonTextarea,
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
} from "@ionic/react";
import Verifica from "../firebase/verifica";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, query, sum, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { chevronDownOutline, trashOutline } from "ionicons/icons";
import "./Despesas.css"
import SelectMonth from "../components/SelectMonth";

const Despesas: React.FC = () => {
    Verifica();

    interface DespesasData {
        id: string;
        data: Date;
        valor: Number;
        descricao: string;
    }

    const [data, setData] = useState(new Date());
    const [valorDespesa, setValorDespesa] = useState(Number);
    const [descricao, setDescricao] = useState();
    const [uid, setUid] = useState("");
    const [despesas, setDespesas] = useState<DespesasData[]>(Array);
    const [despesaTotal, setDespesaTotal] = useState(Number);
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
    const [updateDespesa, setUpdateDespesa] = useState(false);

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
    }, [uid, dataMesSelecionado, updateDespesa])

    async function excluirDespesa(id: any) {
        await deleteDoc(doc(db, "UserFinance", id));

        setUpdateDespesa(!updateDespesa);
    }

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
                                <IonTextarea fill="outline" label="Descrição:" className="input" onIonChange={(e: any) => setDescricao(e.target.value)}></IonTextarea>
                                <IonButton className="btn-add-receita" color={'danger'} onClick={() => { addDespesa() }}>Adicionar despesa</IonButton>
                            </IonCardContent>

                            <SelectMonth></SelectMonth>

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