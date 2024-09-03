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
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import SignGoogle from "../components/SignGoogle";
import SignGitHub from "../components/SignGitHub";
import SignMicrosoft from "../components/SignMicrosoft";
import { auth } from "../firebase/firebase";

const Login: React.FC = () => {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(Object);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        window.location.href = '/home';
      }
    });
  }, []);

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
      <IonContent color={'dark'}>

        <IonGrid fixed={false}>
          <IonRow class="ion-justify-content-center">
            <IonImg src="./versao104.png" className="img-inicial" />
          </IonRow>
          <IonRow className="row-login">
            <IonCol sizeXl="5">
              <IonCard color={'dark2'}>
                <IonCardHeader>
                  <IonCardTitle className="ion-text-center tittle">FAZER LOGIN</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <IonInput color={"success"} label='Login:' placeholder='Email ou CPF' clearInput labelPlacement="floating" fill="outline" onIonChange={(e: any) => setEmail(e.target.value)} className="ion-margin-bottom"></IonInput>

                  <IonInput color={"success"} label='Senha:' placeholder='Senha' type='password' clearInput labelPlacement='floating' fill='outline' onIonChange={(e: any) => setSenha(e.target.value)}></IonInput>

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
                    <SignGitHub></SignGitHub>
                    <SignMicrosoft></SignMicrosoft>
                  </div>
                  

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