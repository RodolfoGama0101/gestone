import { IonButton, IonCol, IonFab, IonFabButton, IonFooter, IonGrid, IonIcon, IonImg, IonLabel, IonRow, IonToolbar } from "@ionic/react";
import { barChartOutline, homeOutline } from "ionicons/icons";

const FooterTabBar: React.FC = () => {
    return (
        
        <IonFooter>
            <IonToolbar color={'dark'}>
                <IonGrid>
                    <IonRow className="ion-text-center">
                        <IonCol>
                            <IonButton href="/Home" color={"dark"}>
                                <IonIcon aria-hidden="true" icon={homeOutline} />
                                <IonLabel>Home</IonLabel>
                            </IonButton>
                        </IonCol>

                        <IonCol className="">
                            <IonFab className="">
                                <IonFabButton href="/Add" color={"dark"}>
                                    <IonImg src='/addIcon.svg' />
                                </IonFabButton>
                            </IonFab>
                        </IonCol>

                        <IonCol>
                            <IonButton href="/Charts" color={"dark"}>
                                <IonIcon aria-hidden="true" icon={barChartOutline} />
                                <IonLabel>Charts</IonLabel>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonToolbar>
        </IonFooter>
    );
}

export default FooterTabBar;