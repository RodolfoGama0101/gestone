import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemDivider, IonList, IonPage, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { createOutline, trashOutline } from "ionicons/icons";
import Verifica from "../firebase/verifica";
import { onAuthStateChanged } from "firebase/auth";
import "./Transferencias.css"

const Transferencias: React.FC = () => {
    Verifica();

    interface SaldoData {
        id: string;
        data: Date;
        valor: Number;
        descricao: string;
    }

    const [uid, setUid] = useState("");
    const [saldo, setSaldo] = useState<SaldoData[]>(Array);
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
    const [updateSaldo, setUpdateSaldo] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                setUid(uid);
            }
        });
    });

    useEffect(() => {
        const imprimirDespesas = async () => {
            const coll = collection(db, 'UserFinance');
            const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado));
            const queryDocs = await getDocs(q);

            const saldoData = queryDocs.docs.map((doc) => {
                const docId = doc.id;
                const docData = doc.data();
                const data = new Date(docData.data.seconds * 1000);

                const combinedData = {
                    id: docId,
                    data: data,
                    valor: docData.valorDespesa,
                    descricao: docData.descricao
                };

                return combinedData;
            });

            setSaldo(saldoData);
        };

        imprimirDespesas();
    }, [uid, dataMesSelecionado, updateSaldo]);

    async function excluirTransferencia(id: any) {
        await deleteDoc(doc(db, "UserFinance", id));

        setUpdateSaldo(!updateSaldo);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'medium'}>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Despesas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonList>
                    {saldo.map(transferencias => {
                        return (
                            <IonItem key={transferencias.id} color={""}>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol>
                                            <IonTitle>{"R$ " + transferencias.valor}</IonTitle>

                                            <IonText>
                                                <p className="ion-no-margin">{transferencias.data.toLocaleDateString()}</p>
                                            </IonText>

                                            <IonText>
                                                <p className="ion-no-margin">{transferencias.descricao}</p>
                                            </IonText>
                                        </IonCol>
                                        <IonCol size="auto">
                                            {/* Edit button */}
                                            <IonButton onClick={() => { }} color={"dark"} className="edit-btn">
                                                <IonIcon icon={createOutline} color={'light'}></IonIcon>
                                                <IonText color={'light'}>Editar</IonText>
                                            </IonButton>
                                            {/* Delete button */}
                                            <IonButton onClick={() => { excluirTransferencia(transferencias.id) }} color={"danger"} className="delete-btn">
                                                <IonIcon icon={trashOutline} color={'light'}></IonIcon>
                                                <IonText color={'light'}>Excluir</IonText>
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>



                            </IonItem>
                        )
                    })}
                </IonList>


                {/* <IonCard color={"medium"}>
                    {saldo.map(transferencias => {
                        return (
                            <IonCard key={transferencias.id} color={"dark2"} className="cards-transferencias">
                                <IonCardContent className="ion-no-margin">
                                    <IonGrid className="ion-align-items-center">
                                        <IonRow className="ion-align-items-center">
                                            <IonCol className="ion-align-items-center">
                                                <IonCardTitle>{"R$ " + transferencias.valorDespesa}</IonCardTitle>
                                                <IonCardSubtitle>{transferencias.data.toLocaleDateString()}</IonCardSubtitle>
                                                <IonCardContent>{transferencias.descricao}</IonCardContent>
                                            </IonCol>
                                            <IonCol size="auto" className="btn-cards-transferencia">
                                                {/ Edit button /}
                                                <IonButton onClick={() => {  }} color={"dark"} className="edit-btn">
                                                    <IonIcon icon={createOutline} color={'medium'}></IonIcon>
                                                    <IonText color={'medium'}>Editar</IonText>
                                                </IonButton>
                                                {/* Delete button /}
                                                <IonButton onClick={() => { excluirTransferencia(transferencias.id) }} color={"dark"} className="delete-btn">
                                                    <IonIcon icon={trashOutline} color={'danger'}></IonIcon>
                                                    <IonText color={'danger'}>Excluir</IonText>
                                                </IonButton>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonCardContent>
                            </IonCard>
                        )
                    })} */}
            </IonContent>
        </IonPage>
    )
}

export default Transferencias;