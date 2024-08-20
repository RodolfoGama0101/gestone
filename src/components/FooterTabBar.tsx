import { IonButton, IonCol, IonFab, IonFabButton, IonFooter, IonGrid, IonIcon, IonImg, IonLabel, IonRow, IonToolbar, IonActionSheet, } from "@ionic/react";
import { barChartOutline, homeOutline, close, trendingDown, trendingUpSharp, repeat } from "ionicons/icons";
import './FooterTab.css';

const FooterTabBar: React.FC = () => {
    return (

        <IonFooter>
            <IonToolbar color={'dark2'} className="toolbar">
                <IonGrid className="grid">
                    <IonRow>
                        <IonCol className="bnt">
                            <IonButton href="/Home" color={"light"} fill="clear" size="large">
                                <IonIcon aria-hidden="true" icon={homeOutline} />
                            </IonButton>
                        </IonCol>

                        <IonCol class="bnt">
                            <IonButton id="open-action-sheet" mode="ios" color={"dark2"} fill="clear" size="small">
                                <IonImg src='/addIcon.svg'/>
                            </IonButton>
                        </IonCol>

                        <IonCol className="bnt">
                            <IonButton href="/Charts" color={"light"} fill="clear" size="large">
                                <IonIcon aria-hidden="true" icon={barChartOutline} />
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
                            window.location.href = "/Transferencias";
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