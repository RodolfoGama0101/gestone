import { IonButton, IonCol, IonFab, IonFabButton, IonFooter, IonGrid, IonIcon, IonImg, IonLabel, IonRow, IonToolbar, IonActionSheet, } from "@ionic/react";
import { barChartOutline, homeOutline, close, trendingDown, trendingUpSharp, repeat } from "ionicons/icons";

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
                                <IonFabButton color={"dark"} id="open-action-sheet">
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

            <IonActionSheet
                className="custom-action-sheet"
                trigger="open-action-sheet"
                buttons={[
                    {
                    icon: trendingDown,
                    text: 'Despesa',
                    role: 'destructive',
                    handler: () => {
                        window.location.href = "/Despesas";
                    },
                    },
                    {
                    icon: trendingUpSharp,
                    text: 'Receita',
                    role: 'destructive',
                    handler: () => {
                        window.location.href = "/Receitas";
                    },
                    },
                    {
                    icon: repeat,
                    text: 'Transferências',
                    role: 'destructive',
                    handler: () => {
                        window.location.href = "/Transferencia";
                    },
                    },
                    {
            
                    icon: close,
                    text: 'Cancel',
                    role: 'cancel',
                    },
                ]}
            ></IonActionSheet>
            
        </IonFooter>

        
        
    );
}

export default FooterTabBar;