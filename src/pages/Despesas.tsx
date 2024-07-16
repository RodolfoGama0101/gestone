import React from "react";
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
    IonButton
} from "@ionic/react";

const Despesas: React.FC = () => {
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
                <IonCard color={'dark'} className="card-add-receita">
                    <IonCardContent>
                        <IonInput label="R$" type="number" className="input" fill="outline" />
                        <IonInput label="Data: " type="date" className="input" fill="outline" />
                        <IonTextarea fill="outline" label="Descrição:" className="input"></IonTextarea>
                        <IonButton className="btn-add-receita" color={'danger'}>Adicionar despesa</IonButton>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default Despesas;