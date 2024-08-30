import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonIcon, IonPopover, IonRow, IonText } from "@ionic/react";
import { onAuthStateChanged } from "firebase/auth";
import { chevronDownOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const SelectMonth: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [mesSelecionado, setMesSelecionado] = useState("");
    const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
    const [userInfo, setUserInfo] = useState(Object);

    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
      ];

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
        <IonGrid color='dark'>
            <IonRow class="ion-justify-content-center">
                <IonCol className="ion-text-center">
                    <IonButton id='trigger-button' className='select-month-btn' color={'danger'}>{mesSelecionado}<IonIcon icon={chevronDownOutline} className='icon-select-month'></IonIcon></IonButton>
                    <IonPopover trigger='trigger-button' alignment='center' className='select-mes'>
                        <IonContent color={'danger'} className='ion-text-center year-select'>
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
    );
}

export default SelectMonth; 