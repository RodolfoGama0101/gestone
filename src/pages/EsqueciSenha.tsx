import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import './Login.css';

const EsqueciSenha: React.FC = () => {
    const [email, setEmail] = useState("");

    const sendEmail = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Email enviado com sucesso!");
                window.location.href = "Login"
            })
            .catch((error) => {
                const errorMessage = error.message;
                window.alert(errorMessage);
            });
    };

    return (
        <IonContent style={{
            '--background': 'var(--ion-color-primary)', // Controla o fundo da página
            '--color': 'var(--ion-text-color)', // Controla a cor do texto
        }}>
            <IonGrid fixed={false}>
                <IonRow className="ion-justify-content-center">
                    <IonImg src="./versao106.png" className="img-inicial" />
                </IonRow>
                <IonRow className="row-login">
                    <IonCol sizeXl="5" sizeLg="6" sizeMd="8" sizeSm="10" sizeXs="12">
                        <IonCard style={{
                            '--background': 'var(--ion-background-color)', // Controla o fundo da página
                            '--color': 'var(--ion-text-color)', // Controla a cor do texto
                        }}>
                            <IonCardContent className="ion-padding">
                                <IonText>
                                    <h1>Esqueceu sua senha?</h1>
                                </IonText>
                                <IonText>
                                    Enviaremos um e-mail com instruções de como redefinir sua senha.
                                </IonText>
                                <IonInput
                                    type="email"
                                    color={"success"}
                                    clearInput
                                    fill="outline"
                                    label="Email:"
                                    placeholder="exemplo@exemplo.com"
                                    labelPlacement='stacked'
                                    className="input-login ion-margin-top"
                                    onIonChange={(e) => setEmail(e.detail.value!)}
                                    required
                                />
                                <IonButton expand="block" onClick={sendEmail} color={'success'} type="button">Enviar</IonButton>
                                <div className="texts-login">
                                    <IonText>
                                        <a href="/Login" className="voltar">Voltar</a>
                                    </IonText>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    );
};

export default EsqueciSenha;
