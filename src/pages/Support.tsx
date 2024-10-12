import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonInput, IonPage, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar } from "@ionic/react";
import './css/Support.css';

const Suporte: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'warning'}>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Suporte</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent style={{
                '--background': 'var(--ion-background-color)', // Controla o fundo da página
                '--color': 'var(--ion-text-color)', // Controla a cor do texto
            }}>
                <div className="pesquisa">
                <IonText className="ion-text-center pesquisa">
                    <h2>Tire sua duvida aqui!</h2>
                </IonText>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <IonSearchbar
                        className="box-pesquisa ion-margin-left"
                        showCancelButton="never"
                        placeholder="Digite sua duvida..."
                        style={{ '--background': 'var(--ion-background-color)',
                            '--color': 'var(--ion-text-color)' }}
                    />

                    <IonButton className="bnt-pesquisa" type="submit" color={'success'}>Enviar</IonButton>
                </div>


                <div className="card-container">

                    <IonCard className="small-card" style={{
                        '--background': 'var(--ion-color-primary-shade)', // Controla o fundo da página
                        '--color': 'var(--ion-text-color)', // Controla a cor do texto
                    }}>
                        <IonCardHeader>
                            <IonCardTitle style={{ '--color': 'var(--ion-text-color)', }}> <h1>Pergunta 1 </h1></IonCardTitle>
                            <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                            Here's a small text description for the card content. Nothing more, nothing less.
                        </IonCardContent>
                    </IonCard>

                    <IonCard className="small-card" style={{
                        '--background': 'var(--ion-color-primary-shade)', // Controla o fundo da página
                        '--color': 'var(--ion-text-color)', // Controla a cor do texto
                    }}>
                        <IonCardHeader>
                            <IonCardTitle style={{ '--color': 'var(--ion-text-color)', }}> <h1>Pergunta 2 </h1></IonCardTitle>
                            <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                            Here's a small text description for the card content. Nothing more, nothing less.
                        </IonCardContent>
                    </IonCard>

                    <IonCard className="small-card" style={{
                        '--background': 'var(--ion-color-primary-shade)', // Controla o fundo da página
                        '--color': 'var(--ion-text-color)', // Controla a cor do texto
                    }}>
                        <IonCardHeader>
                            <IonCardTitle style={{ '--color': 'var(--ion-text-color)', }}> <h1>Pergunta 3 </h1></IonCardTitle>
                            <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                            Here's a small text description for the card content. Nothing more, nothing less.
                        </IonCardContent>
                    </IonCard>

                </div>

            </IonContent>

            <IonFooter className="ion-text-center support-footer">
                <p className="p-footer">Caso tenha mais duvidas entre em contato</p>
                <p className="p-footer">supportgestone@gmail.com</p>
            </IonFooter>
        </IonPage>
    );
}

export default Suporte;
