import { IonButton, IonContent, IonPage, IonText, IonImg } from '@ionic/react';
import './Inicial.css'; // Importe o arquivo de estilos CSS

const Inicial: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen color="dark">
                <IonImg src="./versao106.png" className='img-inicial'/>
                <IonText>
                    <h1 className='ion-text-center'>Seja bem-vindo ao GESTONE!</h1>
                </IonText>
                <div className='btns-inicial'>
                    <IonButton color={"success"} href="/login" className='btn-inicial'>Login</IonButton>
                    <IonButton color={"success"} href="/cadastro" className='btn-inicial'>Cadastro</IonButton>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default Inicial;