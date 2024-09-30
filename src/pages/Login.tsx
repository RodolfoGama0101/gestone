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
  IonTabBar
} from "@ionic/react";
import './Login.css';
import React, { useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import SignGoogle from "../components/SignGoogle";
import SignGitHub from "../components/SignGitHub";
import SignMicrosoft from "../components/SignMicrosoft";
import { auth } from "../firebase/firebase";
import { ThemeContext } from '../components/ThemeContext';

const Login: React.FC = () => {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { isDarkMode } = useContext(ThemeContext);

  const [user, setUser] = useState(Object);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     setUser(user);

  //     if (user) {
  //       window.location.href = '/home';
  //     }
  //   });
  // }, []);

  function loginUser() {
    console.log(email, senha);

    var usuario = null;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        // Signed in 
        usuario = userCredential.user;
        window.location.href = "/Home";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert(errorMessage);
      });
  }

  return (
    <>
      <IonContent style={{
        '--background': 'var(--ion-color-primary)', // Controla o fundo da página
        '--color': 'var(--ion-text-color)', // Controla a cor do texto
      }}>

        <IonGrid fixed={false}>
          <IonRow class="ion-justify-content-center">
            <IonImg src="./versao106.png" className="img-inicial" />
          </IonRow>
          <IonRow className="row-login">
            <IonCol sizeXl="5">
              <IonCard style={{
                '--background': 'var(--ion-background-color)', // Controla o fundo da página
                '--color': 'var(--ion-text-color)', // Controla a cor do texto
              }}>
                <IonCardHeader>
                  <IonCardTitle className="ion-text-center tittle" color={'success'}>FAZER LOGIN</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <IonInput color={"success"} label='Login:' placeholder='E-mail' clearInput labelPlacement="floating" fill="outline" onIonChange={(e: any) => setEmail(e.target.value)} className="ion-margin-bottom"></IonInput>

                  <IonInput color={"success"} label='Senha:' placeholder='Senha' type='password' clearInput labelPlacement="floating" fill='outline' onIonChange={(e: any) => setSenha(e.target.value)}></IonInput>

                  <IonButton expand='block' color={'success'} className="ion-margin-top" onClick={(loginUser)}>
                    <IonText> <h2>Entrar</h2> </IonText>
                  </IonButton>
                  <div className="texts-login ">
                    <IonText>
                      <a href="" className="redefinir-senha">Redefinir senha</a>
                    </IonText>
                  </div>

                  <div className="center-google-btn">
                    <SignGoogle></SignGoogle>
                    {/* <SignGitHub></SignGitHub>
                    <SignMicrosoft></SignMicrosoft> */}
                  </div>
                  <a href="/Inicial" className="voltar">Voltar</a>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

        </IonGrid>
      </IonContent>
    </>
  );
};

export default Login;