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
import { checkmark, link, navigate } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login: React.FC = () => {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

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
        alert(errorMessage);
      });
  }

  return (
    <>
      <IonContent color={'dark'}>

        <IonGrid fixed={true}>
          <IonRow class="ion-justify-content-center">
            <IonImg src="./versao104.png" className="gestone-start-login" />
          </IonRow>
          <IonRow class="ion-justify-content-center">
            <IonCol sizeXl="5">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle className="ion-text-center" color={"success"}>FAZER LOGIN</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <IonInput color={"dark"} label='Login:' placeholder='Email ou CPF' clearInput labelPlacement="floating" fill="solid" onIonChange={(e: any) => setEmail(e.target.value)}></IonInput>

                  <IonInput color={"dark"} label='Senha:' placeholder='Senha' type='password' clearInput labelPlacement='floating' fill='solid' onIonChange={(e: any) => setSenha(e.target.value)}></IonInput>

                  <IonButton expand='block' color={'success'} className="ion-margin-top" onClick={(loginUser)}>
                    <IonText> <h2>Entrar</h2> </IonText>
                  </IonButton>
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