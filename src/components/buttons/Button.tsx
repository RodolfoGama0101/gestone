import { IonButton, IonGrid, IonRow, IonCol, IonText, IonIcon } from "@ionic/react";
import { cashOutline, arrowUp } from "ionicons/icons";
import React from "react";

const SaldoButtonComponent: React.FC = () => {
    return (
        <IonButton color={'light'} expand='block' fill='solid'>
            <IonGrid>
                <IonRow className='ion-align-items-center'>
                    <IonCol>
                        <IonText className='ion-text-start ion-text-uppercase'>
                            <p>Saldo</p>
                        </IonText>
                        <IonText className='ion-text-start'>
                            <h1>R$ 0,00</h1>
                        </IonText>
                    </IonCol>
                    <IonCol>
                        <IonIcon icon={cashOutline} className='ion-float-right ion-padding ion-border home-buttons-icons'></IonIcon>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonButton>
    )
}

export default SaldoButtonComponent;