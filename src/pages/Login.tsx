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
  IonImg
} from "@ionic/react";
import './Login.css';
import React, { useState, useContext } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import SignGoogle from "../components/SignGoogle";
import SignGitHub from "../components/SignGitHub";
import SignMicrosoft from "../components/SignMicrosoft";
import { ThemeContext } from '../components/ThemeContext';
import { eye, eyeOff } from "ionicons/icons";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alterna entre mostrar ou esconder a senha
  };

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
                <IonInput color={"success"} label='Login: ' clearInput fill="outline" onIonChange={(e: any) => setEmail(e.target.value)} className="ion-margin-bottom"/>

                <IonInput
                  value={senha}
                  color={"success"}
                  label='Senha: '
                  type={showPassword ? "text" : "password"}
                  fill='outline'
                  onIonChange={(e: any) => setSenha(e.target.value)}
                  className="ion-margin-bottom"
                >
                  <IonButton
                    fill="clear"
                    slot="end" // Coloca o botão no final do input
                    aria-label="Show/hide"
                    onClick={togglePasswordVisibility}
                    className="eye"
                  >
                    <IonIcon
                      slot="icon-only"
                      icon={showPassword ? eyeOff : eye}
                      color="success"
                      aria-hidden="true"
                    />
                  </IonButton>
                </IonInput>

                <IonButton
                  expand='block'
                  color={'success'}
                  className="ion-margin-top"
                  onClick={loginUser}
                >
                  <IonText><h2>Entrar</h2></IonText>
                </IonButton>

                <div className="texts-login">
                  <IonText>
                    <a href="" className="redefinir-senha">Redefinir senha</a>
                  </IonText>
                </div>

                <div className="center-google-btn">
                  <SignGoogle />
                  <SignMicrosoft />
                  <SignGitHub />
                </div>

                <a href="/Inicial" className="voltar">Voltar</a>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Login;
