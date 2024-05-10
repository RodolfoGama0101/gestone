import React from "react";
import { IonContent, 
    IonPage, 
    IonFooter, 
    IonIcon,
    IonCardHeader,
    IonCardTitle, 
    IonCard, 
    IonCardContent, 
    IonText, 
    IonInput, 
    IonButton,
} from "@ionic/react";
import './Login.css';
import {checkmark} from 'ionicons/icons';

const Login: React.FC = () => {
    return (
        
        <IonContent>


        <IonCardHeader>
            <div className="ion-text-center">
              <IonCardTitle color={'success'}> 
                <h1>GESTONE</h1> 
              </IonCardTitle>
            </div>
          </IonCardHeader>
        
        <IonCard>
          <IonCardContent>
            
            <div className='ion-text-center'>
              <IonText>
                <h1>Entrar no Gestone</h1>
              </IonText>
            </div>
            
            <IonInput label='Login:' placeholder='Email ou CPF' clearInput labelPlacement="floating" fill="solid"></IonInput>

            <IonInput label='Senha:' placeholder='Senha' type='password' clearInput labelPlacement='floating' fill='solid'></IonInput>
            

            <IonButton expand='block' color={'success'}>
            
            <IonIcon slot='start' icon={checkmark}></IonIcon>
            <IonText>
                <h2>Entrar</h2>
            </IonText>
            </IonButton>
          
          </IonCardContent>
        </IonCard>
      </IonContent>
    );
};

export default Login;