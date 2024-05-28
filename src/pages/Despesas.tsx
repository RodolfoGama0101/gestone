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

const Despesas: React.FC = () => {
    return (
        <>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Despesas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonCard></IonCard>
            </IonContent>
        </>
    )
}

export default Despesas;