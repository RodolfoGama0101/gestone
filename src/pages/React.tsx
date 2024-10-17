import { IonCard, IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import React from "react";

const HomePage: React.FC = () => {
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    Página de Apresentação
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    Usuário 01
                </IonCard>
            </IonContent>
        </IonPage>
    );
}

export default HomePage;