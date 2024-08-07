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

            const coll = collection(db, 'Despesas');
            const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado));
    
            const snapshot = await getAggregateFromServer(q, {
                despesaTotal: sum('valorDespesa')
            });
    
            setDespesaTotal(snapshot.data().despesaTotal);
          }
        });
      });

    async function addDespesa() {
        const docRef = await addDoc(collection(db, "Despesas"), {
            data: new Date(data),
            mes: new Date(data).getMonth(),
            valorDespesa: Number(valorDespesa),
            descricao: descricao,
            uid: uid
        });

        window.alert("Despesa adicionada com sucesso!");
        setUpdateDespesa(!updateDespesa);
    }

    useEffect(() => {
        const imprimirDespesas = async () => {
            const coll = collection(db, 'Despesas');
            const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado));
            const queryDocs = await getDocs(q);

            const despesasData = queryDocs.docs.map((doc) => {
                const docId = doc.id;
                const docData = doc.data();
                const data = new Date(docData.data.seconds * 1000);

                const combinedData = {
                    id: docId,
                    data: data,
                    valorDespesa: docData.valorDespesa,
                    descricao: docData.descricao
                };

                return combinedData;
            });

            setDespesas(despesasData);
        };

        imprimirDespesas();
    }, [uid, dataMesSelecionado, updateDespesa]);

    async function excluirDespesa(id: any) {
        await deleteDoc(doc(db, "Despesas", id));

        setUpdateDespesa(!updateDespesa);
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
                        <IonButton className="btn-add-receita" color={'danger'} onClick={() => {addDespesa()}}>Adicionar despesa</IonButton>
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