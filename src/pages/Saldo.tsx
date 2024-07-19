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
import SelectMonthYear from "../components/SelectMonthYear";

const Saldo: React.FC = () => {
    Verifica();

    return (
        <>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Saldo</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <SelectMonthYear></SelectMonthYear>
            </IonContent>
        </>
    )
}

export default Saldo;