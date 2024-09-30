import { IonButton, IonContent, IonPage, IonText, IonImg, IonGrid, IonRow, IonCol } from '@ionic/react';
import './Inicial.css';
import { ThemeContext } from '../components/ThemeContext';
import { useContext } from 'react';

const Inicial: React.FC = () => {
    const { isDarkMode } = useContext(ThemeContext);

    return (
        <IonPage>
            <IonContent fullscreen className='content-inicial' style={{
                '--background': 'var(--ion-background-color)', // Controla o fundo da página
                '--color': 'var(--ion-text-color)', // Controla a cor do texto
            }}>
                <IonGrid >
                    <IonRow class="row-inicial"></IonRow>
                    <IonRow class="row-inicial"></IonRow>
                    <IonRow class="row-inicial">
                        <IonCol>
                            <IonImg className='img-inicial' src="./versao106.png" />
                            <IonText className='text-inicial'>
                                <h1>GESTONE</h1>
                                <h6>Gestao Financeira</h6>
                            </IonText>
                            <IonText>
                                <h1>Seja Bem Vindo!</h1>
                            </IonText>
                            <div className='btn-inicial'>
                                <IonButton color={"success"} href="/login" fill='outline' className='bnt-login'>Fazer Login</IonButton>
                            </div>
                            <IonText style={{
                                '--color': 'var(--ion-text-color)', // Controla a cor do texto
                            }}>
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