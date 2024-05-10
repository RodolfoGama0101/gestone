import './HeaderComponent.css';
import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonImg, IonRouterOutlet } from '@ionic/react';


import { personCircle, personCircleSharp, person, personCircleOutline } from 'ionicons/icons';


const HeaderComponent: React.FC = () => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot='start'>
                    <IonButton href='#'>
                        <IonImg src='public\icone.svg'></IonImg>
                    </IonButton>
                </IonButtons>

                <IonReactRouter>
                    <IonRouterOutlet>
                        <Route path="../../pages/Login" component={Login}>
                            <Login></Login>
                        </Route>
                    </IonRouterOutlet>
                </IonReactRouter>

                <IonButtons slot='end' className='login-button'>
                    <IonButton href='Login'>
                        <IonIcon icon={personCircleOutline}></IonIcon>
                    </IonButton>
                </IonButtons>

                <IonTitle>GESTONE</IonTitle>
            </IonToolbar>
        </IonHeader>
    )
}

export default HeaderComponent;