import { IonButton, IonContent, IonPage, IonText, IonImg, IonGrid, IonRow, IonCol } from '@ionic/react';
import './Inicial.css'; // Importe o arquivo de estilos CSS

const Inicial: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen color="dark" className='content-inicial'>
                <IonGrid >
                    <IonRow class="row-inicial"></IonRow>
                    <IonRow class="row-inicial"></IonRow>
                    <IonRow class="row-inicial">                        
                        <IonCol>
                                <IonImg className='img-inicial' src="./versao104.png" /> {/* Substitua por seu caminho da imagem */}
                                <IonText>
                                    <h1>Seja Bem Vindo!</h1>
                                
                                </IonText>
                                <div className='btn-inicial'>
                                    <IonButton color={"success"} href="/login" fill='outline' className='bnt-login'>Fazer Login</IonButton>
                                    
                                </div>  
                                <IonText>
                                    <a href="/Cadastro" className="fazer-cadastro">Faça o seu cadastro aqui</a>
                                </IonText>
            
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
                
        </IonPage>
    );
};

export default Inicial;