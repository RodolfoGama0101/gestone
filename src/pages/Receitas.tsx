import React, { useState } from "react";
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
    IonCardSubtitle
} from "@ionic/react";
import Verifica from "../firebase/verifica";
import './Receitas.css';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Receitas: React.FC = () => {
    interface ReceitasData {
        id: string;
        data: Date;
        valorReceita?: number; // Make firstName optional if it might not exist in some documents
        descricao: string;
    }

    Verifica();

    const [data, setData] = useState(Date);
    const [valorReceita, setValorReceita] = useState();
    const [descricao, setDescricao] = useState();
    const [uid, setUid] = useState("");
    const [receitas, setReceitas] = useState<ReceitasData[]>(Array);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            setUid(uid);
        }
    });

    async function addReceita() {
        const docRef = await addDoc(collection(db, "Receitas"), {
            data: data,
            valorReceita: valorReceita,
            descricao: descricao,
            uid: uid
        });

        window.alert("Receita adicionada com sucesso!");
    }

    async function imprimirReceitas() {
        const q = query(collection(db, "Receitas"), where("uid", "==", uid))
        const querySnapshot = await getDocs(q);

        const receitasData = querySnapshot.docs.map((doc) => {
            const docId = doc.id;
            const docData = doc.data();
            
            // Combine docId and docData into a single object

            const combinedData: ReceitasData = {
                id: docId,
                data: docData.data, // Use firstName se existir, caso contrário, deixe como string vazia
                valorReceita: docData.valorReceita, // Certifique-se de que a propriedade 'email' está presente no Firestore
                descricao: docData.descricao
            };


            return combinedData;
        });

        setReceitas(receitasData);
    }

    return (
        <IonPage>
            <IonHeader className="">
                <IonToolbar color={'dark'}>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Receitas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent color={'dark'}>
                <IonCard color={'dark'} className="card-add-receita">
                    <IonCardContent>
                        <IonInput label="R$" type="number" className="input" fill="outline" onIonChange={(e: any) => setValorReceita(e.target.value)} />
                        <IonInput label="Data: " type="date" className="input" fill="outline" onIonChange={(e: any) => setData(e.target.value)} />
                        <IonTextarea fill="outline" label="Descrição:" className="input" onIonChange={(e: any) => setDescricao(e.target.value)}></IonTextarea>
                        <IonButton className="btn-add-receita" color={'success'} onClick={addReceita}>Adicionar receita</IonButton>
                    </IonCardContent>
                </IonCard>

                <IonButton onClick={imprimirReceitas}>Imprimir receitas</IonButton>

                <IonCard>
                    {receitas.map(receita => {
                        return (
                            <IonCard key={receita.id}>
                                <IonCardContent>
                                    <IonCardTitle>{"R$ " + receita.valorReceita}</IonCardTitle>
                                    <IonCardSubtitle>{receita.data.toString()}</IonCardSubtitle>
                                    <IonCardContent>{receita.descricao}</IonCardContent>
                                </IonCardContent>
                            </IonCard>
                        )
                    })}
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default Receitas;