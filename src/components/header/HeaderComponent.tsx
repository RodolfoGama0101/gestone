import './HeaderComponent.css';
import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonImg, IonText, IonGrid, IonRow, IonCol, IonRouterLink } from '@ionic/react';
import { personCircle, personCircleSharp, person, personCircleOutline } from 'ionicons/icons';

const HeaderComponent: React.FC = () => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonGrid>
                    <IonRow className='ion-align-items-center'>
                        {/* Ícone Gestone */}
                        <IonCol className='um'>
                            <IonRouterLink href='#'>
                                <IonImg src='public\gestoneLogo\Versão Final\icone.svg'></IonImg>
                            </IonRouterLink>
                        </IonCol>

                        {/* Título */}
                        <IonCol className='dois'>
                            <IonText className='ion-text-left'>
                                <h1>GESTONE</h1>
                            </IonText>
                        </IonCol>

                        {/* Login */}
                        <IonCol className='tres'>
                            <IonRouterLink>
                                <IonButton className='ion-float-right'>
                                    <IonIcon icon={personCircleOutline}></IonIcon>
                                </IonButton>
                            </IonRouterLink>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonToolbar>
        </IonHeader>
    )
}

export default HeaderComponent;