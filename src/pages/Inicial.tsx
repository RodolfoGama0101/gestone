import { IonButton, IonContent, IonPage, IonText, IonImg } from '@ionic/react';
import './Inicial.css'; // Importe o arquivo de estilos CSS

const Inicial: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen color="dark">
                <IonImg src="./versao104.png" /> {/* Substitua por seu caminho da imagem */}
                <IonText>
                    <h1>Seja bem-vindo ao GESTONE!</h1>
                </IonText>
                <div className='btn-inicial'>
                    <IonButton color={""} href="/login">Login</IonButton>
                    <IonButton color={""} href="/cadastro">Cadastro</IonButton>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default Inicial;