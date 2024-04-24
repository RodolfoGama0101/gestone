import './HeaderComponent.css';
import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonImg, IonText, IonGrid, IonRow, IonCol } from '@ionic/react';
import { personCircle, personCircleSharp, person, personCircleOutline } from 'ionicons/icons';

const HeaderComponent: React.FC = () => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonGrid>
                    <IonRow className='ion-align-items-center'>
                        <IonCol size='1' className='um'>
                            <IonImg src='..\public\gestoneLogo\Versão Final\icone.svg'></IonImg>
                        </IonCol>
                        <IonCol size='10' className='dois ion-text-start'>
                            <IonText><h1 className='ion-no-margin ion-no-padding'>GESTONE</h1></IonText>
                            <IonText><p className='ion-no-margin ion-no-padding'>Gestão financeira</p></IonText>
                        </IonCol>
                        <IonCol size='1' className='tres'>
                            <IonButtons>
                                <IonButton>
                                    <IonIcon slot="icon-only" icon={personCircleOutline} className='login-icon'></IonIcon>
                                </IonButton>
                            </IonButtons>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonToolbar>
        </IonHeader>
    )
}

export default HeaderComponent;