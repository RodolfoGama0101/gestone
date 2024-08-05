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
    IonIcon
} from "@ionic/react";
import Verifica from "../firebase/verifica";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getAggregateFromServer, getDoc, getDocs, query, sum, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { trashOutline } from "ionicons/icons";

const Despesas: React.FC = () => {
    Verifica();

    interface DespesasData {
        id: string;
        data: Date;
        valorDespesa: Number;
        descricao: string;
    }

    const [data, setData] = useState(Date);
    const [valorDespesa, setValorDespesa] = useState(Number);
    const [descricao, setDescricao] = useState();
    const [uid, setUid] = useState("");
    const [despesas, setDespesas] = useState<DespesasData[]>(Array);
    const [despesaTotal, setDespesaTotal] = useState(Number);
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());

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

            const coll = collection(db, 'Despesas');
            const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado));
    
            const snapshot = await getAggregateFromServer(q, {
                despesaTotal: sum('valorDespesa')
            });
    
            setDespesaTotal(snapshot.data().despesaTotal);
          }
        });
      });

      useEffect(() => {
        imprimirDespesas();
        console.log("imprimirReceitas();");
    }, [despesaTotal])

    async function addDespesa() {
        const docRef = await addDoc(collection(db, "Despesas"), {
            data: new Date(data),
            mes: new Date(data).getMonth(),
            valorDespesa: Number(valorDespesa),
            descricao: descricao,
            uid: uid
        });
    }

    async function imprimirDespesas() {
        const coll = collection(db, 'Despesas');
        const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado));
        const queryDocs = await getDocs(q);

        const snapshot = await getAggregateFromServer(q, {
            despesaTotalTotal: sum('valorDespesa')
        });

        const despesaData = queryDocs.docs.map((doc) => {
            const docId = doc.id;
            const docData = doc.data();
            const data = new Date(docData.data.seconds * 1000);

            // Combine docId and docData into a single object

            const combinedData: DespesasData = {
                id: docId,
                data: data, // Use firstName se existir, caso contrário, deixe como string vazia
                valorDespesa: docData.valorDespesa, 
                descricao: docData.descricao
            };

            return combinedData;
        });

        setDespesas(despesaData);
    }

    async function excluirDespesa(id: any) {
        await deleteDoc(doc(db, "Despesas", id));
    }

    return (
        <IonPage>
            <IonHeader className="">
                <IonToolbar color={'dark'}>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Despesas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent color={'dark'}>
                <IonText>
                    <h1 className="ion-margin">{despesaTotal}</h1>
                </IonText>

                <IonCard color={'dark'} className="card-add-receita">
                    <IonCardContent>
                        <IonInput label="R$" type="number" className="input" fill="outline" onIonChange={(e: any) => setValorDespesa(e.target.value)} />
                        <IonInput label="Data: " type="date" className="input" fill="outline" onIonChange={(e: any) => setData(e.target.value)} />
                        <IonTextarea fill="outline" label="Descrição:" className="input" onIonChange={(e: any) => setDescricao(e.target.value)}></IonTextarea>
                        <IonButton className="btn-add-receita" color={'danger'} onClick={() => {addDespesa(), imprimirDespesas()}}>Adicionar despesa</IonButton>
                    </IonCardContent>
                </IonCard>

                <IonCard color={"danger"}>
                    {despesas.map(despesa => {
                        return (
                            <IonCard key={despesa.id} color={"dark"}>
                                <IonCardContent>
                                    <IonCardTitle>{"R$ " + despesa.valorDespesa}</IonCardTitle>
                                    <IonCardSubtitle>{despesa.data.toLocaleDateString()}</IonCardSubtitle>
                                    <IonCardContent>{despesa.descricao}</IonCardContent>
                                    <IonButton onClick={() => {excluirDespesa(despesa.id)}} color={"dark"}><IonIcon icon={trashOutline} color={'danger'}></IonIcon><IonText color={'danger'}>Excluir</IonText></IonButton>                                </IonCardContent>
                            </IonCard>
                        )
                    })}
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default Despesas;