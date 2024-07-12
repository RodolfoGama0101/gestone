import React from "react";
import {
    IonHeader,
    IonTitle,
    IonContent,
    IonToolbar,
    IonCard, 
    IonButtons, 
    IonBackButton
} from "@ionic/react";
import Verifica from "../firebase/verifica";

const Receitas: React.FC = () => {
    Verifica();

    return (
        <>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Receitas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonCard></IonCard>
            </IonContent>
        </>
    )
}

export default Receitas;