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
    IonCardSubtitle
} from "@ionic/react";
import Verifica from "../firebase/verifica";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getAggregateFromServer, getDocs, query, sum, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const Despesas: React.FC = () => {
    Verifica();

    interface DespesasData {
        id: string;
        data: Date;
        valorDespesa: Number;
        descricao: string;
    }

    Verifica();

    const [data, setData] = useState(Date);
    const [valorDespesa, setValorDespesa] = useState(Number);
    const [descricao, setDescricao] = useState();
    const [uid, setUid] = useState("");
    const [despesas, setDespesas] = useState<DespesasData[]>(Array);
    const [despesaTotal, setDespesaTotal] = useState(Number);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const uid = user.uid;
            setUid(uid);
    
            const coll = collection(db, 'Despesas');
            const q = query(coll, where("uid", "==", uid));
    
            const snapshot = await getAggregateFromServer(q, {
                despesaTotal: sum('valorDespesa')
            });
    
            setDespesaTotal(snapshot.data().despesaTotal);
          }
        });

        imprimirDespesas()
      });

    async function addDespesa() {
        const docRef = await addDoc(collection(db, "Despesas"), {
            data: new Date(data),
            valorDespesa: Number(valorDespesa),
            descricao: descricao,
            uid: uid
        });

        window.alert("Despesa adicionada com sucesso!");
    }

    async function imprimirDespesas() {
        const coll = collection(db, 'Despesas');
        const q = query(coll, where("uid", "==", uid));
        const queryDocs = await getDocs(q);

        const snapshot = await getAggregateFromServer(q, {
            despesaTotalTotal: sum('valorDespesa')
        });

        const despesaData = queryDocs.docs.map((doc) => {
            const docId = doc.id;
            const docData = doc.data();

            // Combine docId and docData into a single object

            const combinedData: DespesasData = {
                id: docId,
                data: docData.data, // Use firstName se existir, caso contrário, deixe como string vazia
                valorDespesa: docData.valorDespesa, 
                descricao: docData.descricao
            };

            return combinedData;
        });

        setDespesas(despesaData);
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
                        <IonButton className="btn-add-receita" color={'danger'} onClick={addDespesa}>Adicionar despesa</IonButton>
                    </IonCardContent>
                </IonCard>

                <IonCard color={"danger"}>
                    {despesas.map(despesa => {
                        return (
                            <IonCard key={despesa.id} color={"dark"}>
                                <IonCardContent>
                                    <IonCardTitle>{"R$ " + despesa.valorDespesa}</IonCardTitle>
                                    <IonCardSubtitle>{despesa.data.toString()}</IonCardSubtitle>
                                    <IonCardContent>{despesa.descricao}</IonCardContent>
                                </IonCardContent>
                            </IonCard>
                        )
                    })}
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default Despesas;