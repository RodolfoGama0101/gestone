import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";

const Suporte:React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'warning'}>
                    <IonButtons slot="start">                  
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Despesas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonText>
                    <p className="ion-margin">Em manutenção...</p>
                </IonText>
            </IonContent>
        </IonPage>
    )
}

export default Suporte;