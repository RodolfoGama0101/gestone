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
    IonTextarea,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonText,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption
} from "@ionic/react";
import Verifica from "../firebase/verifica";
import './Receitas.css';
import { addDoc, collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, query, sum, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { trashOutline } from "ionicons/icons";

const Receitas: React.FC = () => {
    interface ReceitasData {
        id: string;
        data: Date;
        valorReceita: number;
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
                    receitaTotal: sum('valorReceita')
                });

                setReceitaTotal(snapshot.data().receitaTotal);
            }
        });
    });

    async function addReceita() {
        const docRef = await addDoc(collection(db, "UserFinance"), {
            data: new Date(data),
            mes: new Date(data).getMonth(),
            valorReceita: Number(valorReceita),
            tipo: "receita",
            descricao: descricao,
            uid: uid
        });

        window.alert("Receita adicionada com sucesso!");
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
                    valorReceita: docData.valorReceita,
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
                <IonGrid fixed={false}>
                    <IonText>
                        <h1 className="ion-margin">R$ {receitaTotal}</h1>
                    </IonText>
                    <IonRow class="ion-justify-content-center">
                            <IonCard color={'dark2'} className="card-add-receita">
                                <IonCardContent>
                                    <IonInput label="R$:" type="number" className="input" fill="outline" onIonChange={(e: any) => setValorReceita(e.target.value)} />
                                    <IonInput label="Data: " type="date" className="input" fill="outline" onIonChange={(e: any) => setData(e.target.value)} />
                                    <IonInput label="Descrição:" type="text" className="input" fill="outline" onIonChange={(e: any) => setDescricao(e.target.value)}></IonInput>
                                    <IonButton className="btn-add-receita" color={'success'} onClick={() => { addReceita() }}>Adicionar receita</IonButton>
                                </IonCardContent>

                                <IonCardContent>
                                    <IonCard color={"success"}>
                                        {receitas.map(receita => {
                                            return (
                                            <IonCard key={receita.id} color={"dark2"}>
                                                <IonCardContent>
                                                    <IonCardTitle>{"R$ " + receita.valorReceita}</IonCardTitle>
                                                    <IonCardSubtitle>{receita.data.toLocaleDateString()}</IonCardSubtitle>
                                                    <IonCardContent>{receita.descricao}</IonCardContent>
                                                    <IonButton onClick={() => excluirReceita(receita.id)} color={"dark2"}><IonIcon icon={trashOutline} color={'danger'}></IonIcon><IonText color={'danger'}>Excluir</IonText></IonButton>
                                                </IonCardContent>
                                            </IonCard>
                                        )
                                        })}
                                    </IonCard>
                                </IonCardContent>
                            </IonCard>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default Receitas;