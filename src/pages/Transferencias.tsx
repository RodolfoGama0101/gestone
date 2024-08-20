// import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonContent } from "@ionic/react"
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "../firebase/firebase";

// const Transferencias: React.FC = () => {
//     interface TransferenciaData {
//         id: string;
//         data: Date;
//         valorDespesa: Number;
//         descricao: string;
//     }

//     const [uid, setUid] = useState("");
//     const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());

//     useEffect(() => {
//         const imprimirDespesas = async () => {
//             const coll = collection(db, 'UserFinance');
//             const q = query(coll, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));
//             const queryDocs = await getDocs(q);

//             const despesasData = queryDocs.docs.map((doc) => {
//                 const docId = doc.id;
//                 const docData = doc.data();
//                 const data = new Date(docData.data.seconds * 1000);

//                 const combinedData = {
//                     id: docId,
//                     data: data,
//                     valorDespesa: docData.valorDespesa,
//                     descricao: docData.descricao
//                 };

//                 return combinedData;
//             });

//             setDespesas(despesasData);
//         };

//         imprimirDespesas();
//     }, [uid, dataMesSelecionado, updateDespesa]);

//     return (
//         <IonContent>
//             <IonCard color={"danger"}>
//                 {despesas.map(despesa => {
//                     return (
//                         <IonCard key={despesa.id} color={"dark2"}>
//                             <IonCardContent>
//                                 <IonCardTitle>{"R$ " + despesa.valorDespesa}</IonCardTitle>
//                                 <IonCardSubtitle>{despesa.data.toLocaleDateString()}</IonCardSubtitle>
//                                 <IonCardContent>{despesa.descricao}</IonCardContent>
//                                 <IonButton onClick={() => { excluirDespesa(despesa.id) }} color={"dark"}><IonIcon icon={trashOutline} color={'danger'}></IonIcon><IonText color={'danger'}>Excluir</IonText></IonButton>
//                             </IonCardContent>
//                         </IonCard>
//                     )
//                 })}
//             </IonCard>
//         </IonContent>
//     )
// }

// export default Transferencias;