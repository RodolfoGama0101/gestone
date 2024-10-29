import {
  IonContent,
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
import React, { useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import SignGoogle from "../components/SignGoogle";
import { ThemeContext } from '../components/ThemeContext';
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSetupComplete, setIsSetupComplete] = useState(false); // Verifica se a configuração inicial foi concluída
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Verifique se os dados estão configurados no Firestore
        const refDoc = doc(db, "MesSelecao", user.uid);
        const docSnap = await getDoc(refDoc);
        
        if (docSnap.exists()) {
          // Se os dados já estiverem configurados, redireciona
          setIsSetupComplete(true);
          window.location.href = "/Home";
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
                  className="ion-margin-top ion-no-margin"
                  onClick={loginUser}
                >
                  <IonText><h2>Entrar</h2></IonText>
                </IonButton>

                <div className="text-voltar-login">
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
