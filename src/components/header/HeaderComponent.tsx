import './HeaderComponent.css';
import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonImg, IonText, IonGrid, IonRow, IonCol, IonRouterLink } from '@ionic/react';
import { personCircle, personCircleSharp, person, personCircleOutline } from 'ionicons/icons';
import Login from '../../pages/Login';

const HeaderComponent: React.FC = () => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot='start'>
                    <IonButton href='#'>
                        <IonImg src='resources\gestoneLogo\icone.svg'></IonImg>
                    </IonButton>
                </IonButtons>

                <IonButtons slot='end' className='login-button'>
                    <IonButton href='../../pages/Login.tsx'>
                        <IonIcon icon={personCircleOutline}></IonIcon>
                    </IonButton>
                </IonButtons>

                <IonTitle>GESTONE</IonTitle>
            </IonToolbar>
        </IonHeader>

        
    )
}

export default HeaderComponent;