import { IonButton, IonCol, IonFab, IonFabButton, IonFooter, IonGrid, IonIcon, IonImg, IonLabel, IonRow, IonToolbar } from "@ionic/react";
import { barChartOutline, homeOutline } from "ionicons/icons";

const FooterTabBar: React.FC = () => {
    return (
        <IonFooter>
            <IonToolbar>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonButton href="/Home">
                                <IonIcon aria-hidden="true" icon={homeOutline} />
                                <IonLabel>Home</IonLabel>
                            </IonButton>
                        </IonCol>

                        <IonCol>
                            <IonFab className="">
                                <IonFabButton href="/Add">
                                    <IonImg src='/addIcon.svg' />
                                </IonFabButton>
                            </IonFab>
                        </IonCol>

                        <IonCol>
                            <IonButton href="/Charts">
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