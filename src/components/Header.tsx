import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonImg } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import "./Header.css";

const HeaderComponent: React.FC = () => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot='start'>
                    <IonButton href='#'>
                        <IonImg src='/icone.svg'></IonImg>
                    </IonButton>
                </IonButtons>
  
                <IonButtons slot='end' className='login-button'>
                    <IonButton href='/Login'>
                        <IonIcon icon={personCircleOutline}></IonIcon>
                    </IonButton>
                </IonButtons>
  
                <IonTitle>GESTONE</IonTitle>
            </IonToolbar>
        </IonHeader>
    )
}

export default HeaderComponent;