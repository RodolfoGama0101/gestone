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
    IonItemOption,
    IonItemOptions,
} from "@ionic/react";
import { exitOutline, logOut, personCircleOutline, pin, share, trash } from "ionicons/icons";
import "./Header.css";

const HeaderComponent: React.FC = () => {
    return (
        <>
            <IonMenu contentId="main-content" side="end">
                <IonHeader>
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
                    </IonList>
                </IonContent>
            </IonMenu>

            <IonHeader id="main-content">
                <IonToolbar>
                    <IonButtons slot="end">
                        <IonMenuButton>
                            <IonIcon icon={personCircleOutline}></IonIcon>
                        </IonMenuButton>
                    </IonButtons>
                    <IonTitle>Gestone</IonTitle>
                </IonToolbar>
            </IonHeader>
        </>
    )
}

export default HeaderComponent;