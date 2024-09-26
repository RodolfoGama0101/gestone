import { IonButton, IonCol, IonFab, IonFabButton, IonFooter, IonGrid, IonIcon, IonImg, IonLabel, IonRow, IonToolbar, IonActionSheet, } from "@ionic/react";
import { barChartOutline, homeOutline, close, trendingDown, trendingUpSharp, repeat } from "ionicons/icons";
import './FooterTab.css';

const FooterTabBar: React.FC = () => {
    return (

        <IonFooter>
            <IonToolbar style={{
                '--background': 'var(--ion-color-primary)', // Controla o fundo da página
                '--color': 'var(--ion-text-color)', // Controla a cor do texto
            }}>
                <IonGrid className="grid">
                    <IonRow className="ion-align-items-center">
                        <IonCol className="bnt ion-align-items-center">
                            <IonButton href="/Home" fill="clear" style={{
                                '--color': 'var(--ion-text-color)', // Controla a cor do texto
                            }}>
                                <IonIcon aria-hidden="true" icon={homeOutline} slot="icon-only" className="icons-footer" style={{
                                '--color': 'var(--ion-text-color)'
                            }} />
                            </IonButton>
                        </IonCol>

                        <IonCol class="bnt">
                            <IonButton id="open-action-sheet" fill="clear">
                                <IonImg src='/addIcon.svg' slot="icon-only" />
                            </IonButton>
                        </IonCol>

                        <IonCol className="bnt ion-align-items-center">
                            <IonButton href="/Charts" fill="clear" style={{
                                '--color': 'var(--ion-text-color)', // Controla a cor do texto
                            }}>
                                <IonIcon aria-hidden="true" icon={barChartOutline} slot="icon-only" className="icons-footer" />
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonToolbar>

            <IonActionSheet
                className="custom-action-sheet"
                trigger="open-action-sheet"
                cssClass="light-action-sheet"
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