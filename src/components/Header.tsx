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
import { exitOutline, logOut, personCircleOutline, pin, share, trash, personOutline, cardOutline, alertCircleOutline, document } from "ionicons/icons";
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
                            <IonIcon aria-hidden="true" slot="start" icon={document}></IonIcon>
                            <IonLabel>Dados Pessoais</IonLabel>
                        </IonItem>
                        
                        <IonItem button={true} href="/Login">
                            <IonIcon aria-hidden="true" slot="start" icon={personOutline}></IonIcon>
                            <IonLabel>Sua Conta</IonLabel>
                        </IonItem>

                        <IonItem button={true} href="/Login">
                            <IonIcon aria-hidden="true" slot="start" icon={cardOutline}></IonIcon>
                            <IonLabel>Cartões</IonLabel>
                        </IonItem>

                        <IonItem button={true} href="/Login">
                            <IonIcon aria-hidden="true" slot="start" icon={alertCircleOutline}></IonIcon>
                            <IonLabel>Support</IonLabel>
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
                    <IonButtons slot="end" className="ion-margin-right">
                        <IonMenuButton>
                            <IonIcon icon={personCircleOutline}></IonIcon>
                        </IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
        </>
    )
}

export default HeaderComponent;