import React from "react";
import {
    IonHeader,
    IonTitle,
    IonContent,
    IonToolbar,
    IonCard,
    IonButtons,
    IonBackButton,
    IonPage
} from "@ionic/react";

const Despesas: React.FC = () => {
    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Despesas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                
            </IonContent>
        </IonPage>
    )
}

export default Despesas;