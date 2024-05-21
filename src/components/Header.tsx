import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonMenu,
    IonMenuButton,
    IonContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonAvatar,
    IonLabel,
    IonText,
    IonImg, 
    IonButton
} from "@ionic/react";
import { exitOutline, logOut, personCircleOutline, pin, share, trash } from "ionicons/icons";
import "./Header.css";

const HeaderComponent: React.FC = () => {
    return (
        <>
            <IonMenu contentId="main-content" side="end">
                <IonHeader className="ion-no-border">
                    <IonToolbar>
                        <IonTitle>Menu</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList>
                        <IonItem button={true} href="/Login">
                            <IonIcon aria-hidden="true" slot="start" icon={exitOutline}></IonIcon>
                            <IonLabel>Logout</IonLabel>
                        </IonItem>
                        <IonItem button={true} href="/Login">
                            <IonIcon aria-hidden="true" slot="start" icon={exitOutline}></IonIcon>
                            <IonLabel>Logout</IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>

            <IonHeader id="main-content" className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="end">
                        <IonMenuButton>
                            <IonIcon icon={personCircleOutline}></IonIcon>
                        </IonMenuButton>
                    </IonButtons>
                    <IonButtons slot='start'>
                        <IonButton href='#'>
                            <IonImg src='/icone.svg'></IonImg>
                        </IonButton>
                    </IonButtons>

                    <IonTitle>GESTONE</IonTitle>
                </IonToolbar>
            </IonHeader>
        </>
    )
}

export default HeaderComponent;