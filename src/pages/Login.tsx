import {
  IonContent,
  IonIcon,
  IonCardHeader,
  IonCardTitle,
  IonCard,
  IonCardContent,
  IonText,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonInputPasswordToggle
} from "@ionic/react";
import './css/Login.css';
import React, { useState, useContext } from 'react';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import SignGoogle from "../components/SignGoogle";
import { ThemeContext } from '../components/ThemeContext';


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { isDarkMode } = useContext(ThemeContext);


  const loginUser = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        window.location.href = "/Home"; // Redireciona após o login
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
          <IonCol sizeXl="5">
            <IonCard style={{
              '--background': 'var(--ion-background-color)', // Controla o fundo da página
              '--color': 'var(--ion-text-color)', // Controla a cor do texto
            }}>
              <IonCardHeader>
                <IonCardTitle className="ion-text-center title" color={'success'}>FAZER LOGIN</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonInput color={"success"} clearInput fill="outline" label="Login:" placeholder="Exemple@exemple" labelPlacement='stacked' onIonChange={(e: any) => setEmail(e.target.value)} className="input-login" />
                <IonInput color={"success"} type="password" fill='outline' label="Senha:" placeholder="********" labelPlacement='stacked' onIonChange={(e: any) => setSenha(e.target.value)} className="input-login">
                  <IonInputPasswordToggle slot="end" color={"success"}></IonInputPasswordToggle>
                </IonInput>

                <div className="texts-login">
                  <IonText>
                    <a href={"EsqueciSenha"} className="redefinir-senha">Redefinir senha</a>
                  </IonText>
                </div>


                <IonButton
                  expand='block'
                  color={'success'}
                  className="ion-margin-top"
                  onClick={loginUser}
                >
                  <IonText><h2>Entrar</h2></IonText>
                </IonButton>

                <div className="line-container">
                  <div className="line"></div>
                    <IonText>OU</IonText>
                  <div className="line"></div>
                </div>

                <SignGoogle />

                <div className="texts-voltar">
                  <IonText>
                    <a href="/Inicial" className="voltar">Voltar</a>
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

export default Login;
